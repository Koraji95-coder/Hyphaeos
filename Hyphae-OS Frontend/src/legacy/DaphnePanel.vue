<template>
  <section>
    <h2>{{ name }} {{ emoji }}</h2>

    <div class="output">
      <span v-if="loading" class="typing">
        ⏳ Thinking<span class="dot">.</span><span class="dot">.</span><span class="dot">.</span>
      </span>
      <span v-else>{{ output }}</span>
    </div>

    <input :placeholder="`Ask ${name}...`" v-model="input" />
    <button @click="sendPrompt">Send</button>

    <button @click="showHistory = !showHistory">🧠 History</button>
    <button @click="clearHistory">🧼 Clear</button>

    <div v-if="showHistory" class="history">
      <ul>
        <li v-for="entry in history" :key="entry.timestamp">
          🕒 {{ entry.timestamp }}<br />
          <strong>Prompt:</strong> {{ entry.prompt }}<br />
          <strong>Response:</strong> {{ entry.response }}
        </li>
      </ul>
    </div>
  </section>
</template>

<script>
import { useToast } from "vue-toastification";
import { PanelSettings } from "@/config/panelSettings.js";

export default {
  name: "DaphnePanel",
  data() {
    return {
      name: "Daphne",
      emoji: "💬",
      route: "daphne",
      input: "",
      output: "",
      loading: false,
      showHistory: false,
      history: [],
      toast: null,
      agentOnline: true,
      heartbeatInterval: null,
    };
  },
  computed: {
    historyKey() {
      return `hyphaeos-history-${this.route}`;
    },
  },
  mounted() {
    this.toast = useToast();
    this.toast.info(`${this.name} is online.`, { timeout: 2500 });

    this.loadLastSession();

    const settings = panelSettings[this.route] || {};
    if (settings.toasts) {
      this.toast.success(`${this.name} ready.`);
    }
    if (settings.heartbeat) {
      this.runHeartbeat();
    }
  },
  beforeUnmount() {
    clearInterval(this.heartbeatInterval);
  },
  methods: {
    async sendPrompt() {
      this.loading = true;
      this.output = "";

      try {
        const res = await fetch(`/api/${this.route}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt: this.input }),
        });

        if (!res.ok) throw new Error(`Server error ${res.status}`);
        const data = await res.json();

        this.output = data.response || "⚠️ No response";

        const log = {
          prompt: this.input,
          response: data.response,
          timestamp: new Date().toISOString(),
        };

        const stored = JSON.parse(sessionStorage.getItem(this.historyKey)) || [];
        stored.push(log);
        sessionStorage.setItem(this.historyKey, JSON.stringify(stored));
        this.history = stored;

        await fetch("/api/logs/save", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(log),
        });

        this.toast.success(`${this.name} responded.`);
      } catch (err) {
        this.output = "❌ Error";
        this.toast.error(`Failed to reach ${this.name}`);
        console.error(err);
      } finally {
        this.loading = false;
      }
    },
    clearHistory() {
      sessionStorage.removeItem(this.historyKey);
      this.history = [];
      this.toast("🧼 History cleared.");
    },
    loadLastSession() {
      const stored = JSON.parse(sessionStorage.getItem(this.historyKey)) || [];
      this.history = stored;
      if (stored.length > 0) {
        const last = stored[stored.length - 1];
        this.input = last.prompt;
        this.output = last.response;
      }
    },
    runHeartbeat() {
      this.heartbeatInterval = setInterval(() => {
        this.toast.info(`${this.name} still alive 🟢`);
      }, 30000);
    },
  },
};
</script>

<style scoped>
.output {
  padding: 1rem;
  background: #f5f5f5;
  min-height: 100px;
  margin-bottom: 1rem;
}
.typing .dot {
  animation: blink 1.2s infinite;
}
@keyframes blink {
  0%, 100% { opacity: 0.2; }
  50% { opacity: 1; }
}
</style>
