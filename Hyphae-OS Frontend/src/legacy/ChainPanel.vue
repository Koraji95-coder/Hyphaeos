<template>
  <section>
    <h2>Agent Chain 🔁</h2>

    <!-- 🧱 Step-by-step agent sequence -->
    <div v-for="(step, index) in chain" :key="index" class="step">
      <label>Step {{ index + 1 }}</label>
      <select v-model="step.agent">
        <option disabled value="">Choose agent</option>
        <option value="bart">Bart</option>
        <option value="daphne">Daphne</option>
        <option value="cortexa">Cortexa</option>
      </select>
      <input v-model="step.prompt" placeholder="Prompt for this agent..." />
    </div>

    <button @click="addStep">➕ Add Step</button>

    <!-- 🌐 Base input shared by chain -->
    <textarea v-model="baseInput" placeholder="Shared input (optional)"></textarea>

    <!-- 🧠 User Input Run Agent Chain-->
    <textarea v-model="input" placeholder="Run a chain..."></textarea>
    <button @click="runChain">▶️ Execute</button>

    <!-- 📤 Output display -->
    <h3 style="margin-top: 1rem;">📤 Chain Output</h3>
    <pre class="output">{{ output }}</pre>
  </section>
</template>

<script>
import { useToast } from "vue-toastification";
import { PanelSettings } from "@/config/panelSettings.js";


export default {
  name: "ChainPanel",
  data() {
    return {
      input: "",
      output: "",
      baseInput: "",
      chain: [
        { agent: "", prompt: "" },
      ],
      toast: null,
    };
  },
  mounted() {
    this.toast = useToast();
    const config = panelSettings["chain"];
    if (config?.heartbeat) {
      this.runChain();
    }
  },
  methods: {
    addStep() {
      this.chain.push({ agent: "", prompt: "" });
    },
    async runChain() {
      this.output = "⏳ Running chain...";
      try {
        const res = await fetch("/api/chain/run", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            prompt: this.input,
            chain: this.chain,
            baseInput: this.baseInput,
          }),
        });

        if (!res.ok) throw new Error(`Server error ${res.status}`);
        const data = await res.json();
        this.output = JSON.stringify(data, null, 2);
        this.toast.success("✅ Chain executed.");
      } catch (err) {
        this.output = "❌ Chain execution failed.";
        this.toast.error("🚨 Chain API error.");
        console.error(err);
      }
    },
  },
};
</script>

<style scoped>
.step {
  margin-bottom: 1rem;
  padding: 0.5rem;
  background: #1a1a1a;
  border: 1px solid #333;
  border-radius: 6px;
}
select,
input,
textarea {
  display: block;
  margin-top: 0.25rem;
  margin-bottom: 0.5rem;
  background: #222;
  color: white;
  padding: 0.3rem;
  border: 1px solid #444;
  width: 100%;
  box-sizing: border-box;
}
.output {
  background: #111;
  color: #0f0;
  padding: 1rem;
  margin-top: 1rem;
  white-space: pre-wrap;
}
</style>
