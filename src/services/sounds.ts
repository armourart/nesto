// Web Audio API Sound Synthesizer for Nesto
class SoundService {
  private ctx: AudioContext | null = null;
  private ringtoneInterval: number | null = null;

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  playMessageSent() {
    try {
      const ctx = this.getContext();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(540, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.08);

      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.08);
    } catch {
      // Audio autoplay policy
    }
  }

  playMessageReceived() {
    try {
      const ctx = this.getContext();
      if (!ctx) return;
      
      const now = ctx.currentTime;
      // Tone 1
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = 'triangle';
      osc1.frequency.setValueAtTime(659.25, now); // E5
      gain1.gain.setValueAtTime(0.15, now);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start(now);
      osc1.stop(now + 0.12);

      // Tone 2
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(987.77, now + 0.06); // B5
      gain2.gain.setValueAtTime(0.15, now + 0.06);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start(now + 0.06);
      osc2.stop(now + 0.22);
    } catch {
      // Audio autoplay policy
    }
  }

  startIncomingRingtone() {
    this.stopRingtone();
    const playRingCycle = () => {
      try {
        const ctx = this.getContext();
        if (!ctx) return;
        const now = ctx.currentTime;

        const chord = [523.25, 659.25, 783.99]; // C Major high chord
        chord.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now + idx * 0.04);
          gain.gain.setValueAtTime(0.1, now + idx * 0.04);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35 + idx * 0.04);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + idx * 0.04);
          osc.stop(now + 0.4 + idx * 0.04);
        });

        // Secondary pulse
        setTimeout(() => {
          const pulseCtx = this.getContext();
          if (!pulseCtx) return;
          const pNow = pulseCtx.currentTime;
          const osc = pulseCtx.createOscillator();
          const gain = pulseCtx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(880, pNow);
          gain.gain.setValueAtTime(0.1, pNow);
          gain.gain.exponentialRampToValueAtTime(0.001, pNow + 0.25);
          osc.connect(gain);
          gain.connect(pulseCtx.destination);
          osc.start(pNow);
          osc.stop(pNow + 0.25);
        }, 320);
      } catch {
        // Audio autoplay policy
      }
    };

    playRingCycle();
    this.ringtoneInterval = window.setInterval(playRingCycle, 2200);
  }

  stopRingtone() {
    if (this.ringtoneInterval) {
      clearInterval(this.ringtoneInterval);
      this.ringtoneInterval = null;
    }
  }

  playCallConnected() {
    try {
      const ctx = this.getContext();
      if (!ctx) return;
      const now = ctx.currentTime;
      [440, 554.37, 659.25].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.frequency.setValueAtTime(freq, now + i * 0.05);
        gain.gain.setValueAtTime(0.15, now + i * 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25 + i * 0.05);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + i * 0.05);
        osc.stop(now + 0.3 + i * 0.05);
      });
    } catch {
      // Audio autoplay policy
    }
  }

  playCallEnded() {
    try {
      const ctx = this.getContext();
      if (!ctx) return;
      const now = ctx.currentTime;
      [659.25, 554.37, 440].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.frequency.setValueAtTime(freq, now + i * 0.07);
        gain.gain.setValueAtTime(0.12, now + i * 0.07);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2 + i * 0.07);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + i * 0.07);
        osc.stop(now + 0.25 + i * 0.07);
      });
    } catch {
      // Audio autoplay policy
    }
  }

  playBubbleTap() {
    try {
      const ctx = this.getContext();
      if (!ctx) return;
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(700, now);
      osc.frequency.exponentialRampToValueAtTime(1200, now + 0.04);
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.04);
    } catch {
      // Autoplay
    }
  }
}

export const sounds = new SoundService();
