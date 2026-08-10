package main

import (
	"encoding/json"
	"fmt"
	"log"
	"math/rand"
	"net/http"
	"os"
	"strconv"
	"time"

	"github.com/PypNetty/klixy/internal/proxmox"
	sshproxy "github.com/PypNetty/klixy/internal/ssh"
	"github.com/joho/godotenv"
)

type SessionResponse struct {
	SessionID string `json:"sessionID"`
	VMIP      string `json:"vmIP"`
	VMID      int    `json:"vmID"`
}

func corsMiddleware(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, DELETE, OPTIONS") // <-- DELETE ajouté ici
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
		if r.Method == "OPTIONS" {
			w.WriteHeader(http.StatusOK)
			return
		}
		next(w, r)
	}
}

func isMockArena() bool {
	if os.Getenv("MOCK_ARENA") == "true" {
		return true
	}
	return os.Getenv("PROXMOX_HOST") == ""
}

func startArena(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	incident := r.URL.Query().Get("incident")
	vmID := 300 + rand.Intn(600)

	if isMockArena() {
		log.Printf("[Arena][MOCK] Session incident=%s vmID=%d (Proxmox non configuré)", incident, vmID)
		time.Sleep(1500 * time.Millisecond)
		json.NewEncoder(w).Encode(SessionResponse{
			SessionID: fmt.Sprintf("mock_sess_%d", time.Now().Unix()),
			VMIP:      "",
			VMID:      vmID,
		})
		return
	}

	client := proxmox.NewClient()
	vmName := fmt.Sprintf("klixy-arena-%d", vmID)

	log.Printf("[Arena] Cloning VM %d (%s)...", vmID, vmName)
	_, err := client.CloneVM(vmID, vmName)
	if err != nil {
		log.Printf("[Arena] Clone failed: %v", err)
		http.Error(w, `{"error":"clone failed"}`, http.StatusInternalServerError)
		return
	}

	// 1. Injecter la configuration utilisateur générale
	log.Printf("[Arena] Injecting core Cloud-Init configuration into VM %d...", vmID)
	err = client.ConfigureCloudInit(vmID, "user=local:snippets/klixy-user-data.yaml")
	if err != nil {
		log.Printf("[Arena] ConfigureCloudInit warning: %v", err)
	}

	// 2. Injecter la clé SSH publique
	home, _ := os.UserHomeDir()
	if pubKeyBytes, err := os.ReadFile(home + "/.ssh/id_ed25519.pub"); err == nil {
		if err := client.SetSSHKey(vmID, string(pubKeyBytes)); err != nil {
			log.Printf("[Arena] SetSSHKey warning: %v", err)
		} else {
			log.Printf("[Arena] SSH key injected into VM %d", vmID)
		}
	}

	log.Printf("[Arena] Starting VM %d...", vmID)
	if err := client.StartVM(vmID); err != nil {
		log.Printf("[Arena] Start failed: %v", err)
		http.Error(w, `{"error":"start failed"}`, http.StatusInternalServerError)
		return
	}

	log.Printf("[Arena] Waiting for VM %d to boot...", vmID)
	var vmIP string
	for i := 0; i < 12; i++ {
		time.Sleep(10 * time.Second)
		ip, err := client.GetVMIP(vmID)
		if err == nil && ip != "" {
			vmIP = ip
			break
		}
		log.Printf("[Arena] Waiting... attempt %d/12", i+1)
	}

	if vmIP == "" {
		http.Error(w, `{"error":"timeout waiting for VM IP"}`, http.StatusInternalServerError)
		return
	}

	sessionID := fmt.Sprintf("sess_%d_%d", vmID, time.Now().Unix())
	log.Printf("[Arena] VM ready — ID: %d, IP: %s, Session: %s", vmID, vmIP, sessionID)

	json.NewEncoder(w).Encode(SessionResponse{
		SessionID: sessionID,
		VMIP:      vmIP,
		VMID:      vmID,
	})
}

func stopArena(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	vmIDStr := r.URL.Query().Get("vmid")
	vmID, _ := strconv.Atoi(vmIDStr)

	if vmID == 0 {
		http.Error(w, `{"error":"vmid manquant"}`, http.StatusBadRequest)
		return
	}

	if isMockArena() {
		log.Printf("[Arena][MOCK] Stop VM %d (no-op)", vmID)
		w.Write([]byte(`{"status":"stopped"}`))
		return
	}

	log.Printf("[Arena] Stopping VM %d...", vmID)
	client := proxmox.NewClient()
	if err := client.StopVM(vmID); err != nil {
		log.Printf("[Arena] Stop failed: %v", err)
		http.Error(w, `{"error":"stop failed"}`, http.StatusInternalServerError)
		return
	}

	w.Write([]byte(`{"status":"stopped"}`))
}

func deleteArena(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	vmIDStr := r.URL.Query().Get("vmid")
	vmID, _ := strconv.Atoi(vmIDStr)

	if vmID == 0 {
		http.Error(w, `{"error":"vmid manquant"}`, http.StatusBadRequest)
		return
	}

	if isMockArena() {
		log.Printf("[Arena][MOCK] Delete VM %d (no-op)", vmID)
		w.Write([]byte(`{"status":"deleted"}`))
		return
	}

	log.Printf("[Arena] Deleting VM %d...", vmID)
	client := proxmox.NewClient()

	// On demande un stop propre avant de supprimer (sinon Proxmox verrouille la suppression)
	client.StopVM(vmID)
	time.Sleep(3 * time.Second) // Petit délai de courtoisie pour l'arrêt

	if err := client.DeleteVM(vmID); err != nil {
		log.Printf("[Arena] Delete failed: %v", err)
		http.Error(w, `{"error":"delete failed"}`, http.StatusInternalServerError)
		return
	}

	w.Write([]byte(`{"status":"deleted"}`))
}

func main() {
	godotenv.Overload(".env") // Overload pour s'assurer qu'on écrase le cache du terminal

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	http.HandleFunc("/ws/pty", sshproxy.HandlePTY)
	http.HandleFunc("/arena/start", corsMiddleware(startArena))
	http.HandleFunc("/arena/stop", corsMiddleware(stopArena))     // <-- Route STOP
	http.HandleFunc("/arena/delete", corsMiddleware(deleteArena)) // <-- Route DELETE
	http.HandleFunc("/health", corsMiddleware(func(w http.ResponseWriter, r *http.Request) {
		fmt.Fprintf(w, `{"status":"ok"}`)
	}))

	log.Printf("Kyernal backend démarré sur :%s (mock=%v)", port, isMockArena())
	log.Fatal(http.ListenAndServe("0.0.0.0:"+port, nil))
}
