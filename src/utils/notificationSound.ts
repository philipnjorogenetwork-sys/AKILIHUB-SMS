/**
 * Notification Sound Utility
 * Plays a notification sound when messages are received
 */

export function playNotificationSound() {
  try {
    // Create a simple notification sound using Web Audio API
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const now = audioContext.currentTime;

    // Create oscillator nodes for a pleasant notification sound
    const oscillator1 = audioContext.createOscillator();
    const oscillator2 = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    // Set frequencies (musical notes)
    oscillator1.frequency.value = 800; // Higher note
    oscillator2.frequency.value = 600; // Lower note

    oscillator1.type = "sine";
    oscillator2.type = "sine";

    // Set up the sound envelope
    gainNode.gain.setValueAtTime(0.3, now);
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.5);

    // Connect the oscillators to the gain node and to speakers
    oscillator1.connect(gainNode);
    oscillator2.connect(gainNode);
    gainNode.connect(audioContext.destination);

    // Start and stop the sound
    oscillator1.start(now);
    oscillator2.start(now);
    oscillator1.stop(now + 0.3);
    oscillator2.stop(now + 0.25);
  } catch (error) {
    console.log("Could not play notification sound:", error);
  }
}

/**
 * Alternative: Use a data URL for a simple beep sound
 * This is more reliable across browsers
 */
export function playNotificationBeep() {
  try {
    // Create a simple beep sound using a data URL
    const audioUrl = "data:audio/wav;base64,UklGRiYAAABXQVZFZm10IBAAAAABAAEAQB8AAAB9AAACABAAZGF0YQIAAAAAAA==";
    const audio = new Audio(audioUrl);
    audio.volume = 0.5;
    audio.play().catch(err => console.log("Could not play beep:", err));
  } catch (error) {
    console.log("Could not play notification beep:", error);
  }
}

/**
 * Play notification sound - tries Web Audio API first, falls back to beep
 */
export function playMessageNotification() {
  // Check if notifications are enabled in browser
  if ("Notification" in window && Notification.permission === "granted") {
    try {
      playNotificationSound();
    } catch {
      playNotificationBeep();
    }
  } else {
    // Fallback to simple beep
    try {
      playNotificationSound();
    } catch {
      // Silent if Web Audio API not available
    }
  }
}
