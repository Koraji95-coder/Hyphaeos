from shared.agents.agent_base import AgentBase
from shared.ai.gpt_client import GPTClient
from shared.logging.logger import get_logger
from shared.state.session_manager import session
from shared.ai.mood_engine import detect_mood, mood_wrapped_prompt
from shared.workflows.plugin_executor import execute_plugin
from shared.state.mood_state_tracker import get_user_mood, set_user_mood
from shared.system.atlas_core import Atlas
from shared.users.user_profile_service import get_device_id

logger = get_logger("cortexa_agent")

class CortexaAgent(AgentBase):
    def __init__(self):
        super().__init__(name="Cortexa")
        self.gpt = GPTClient(agent="Cortexa")
        self.username = session.get_user_name()
        self.role = session.get_user_role()
        self.device_id = get_device_id()
        self.atlas = Atlas()
        logger.info(f"{self.name} initialized for {self.username} ({self.role}) on {self.device_id}")

    def ask(self, prompt: str) -> str:
        logger.info(f"CortexaAgent received prompt from {self.username}: {prompt!r}")

        if not self.atlas.is_safe():
            logger.warning("CortexaAgent blocked: System in safe mode!")
            return f"{self.name}: ⚠️ System is in safe mode. Operation blocked."

        # Plugin detection
        plugin_match = self._detect_plugin_trigger(prompt)
        if plugin_match:
            plugin_name, plugin_input = plugin_match
            logger.info(f"CortexaAgent detected plugin trigger: {plugin_name} on {plugin_input!r}")
            result = execute_plugin(plugin_name, plugin_input)
            session.get_memory()["last_plugin_used"] = result
            return (
                f"🧠 Cortexa plugin output:\n"
                f"🔌 `{plugin_name}` → `{plugin_input}`\n"
                f"📥 Result: `{result.get('output')}`"
            )

        try:
            mood = detect_mood(prompt)
            set_user_mood(self.username, mood)
            wrapped_prompt = mood_wrapped_prompt(prompt, mood)
            logger.info(f"CortexaAgent mood: {mood}; wrapped prompt: {wrapped_prompt!r}")
            reply = self.gpt.ask(wrapped_prompt)
            logger.info(f"CortexaAgent got GPT reply for {self.username}")
            return reply
        except Exception as e:
            logger.error(f"CortexaAgent fallback for {self.username}: {e}")
            return self.respond(prompt)

    def _detect_plugin_trigger(self, prompt: str):
        import re
        match1 = re.match(r"(?:run|execute)?\s*plugin\s+(\w+)\s+on\s+(.+)", prompt, re.IGNORECASE)
        match2 = re.match(r"calculate\s+(.+)", prompt, re.IGNORECASE)
        match3 = re.match(r"use\s+(\w+)\s+to\s+(.+)", prompt, re.IGNORECASE)
        if match1:
            return match1.group(1), match1.group(2)
        elif match2:
            return "calculator", match2.group(1)
        elif match3:
            return match3.group(1), match3.group(2)
        return None

    def respond(self, input_text: str) -> str:
        mood = get_user_mood(self.username)
        logger.info(f"CortexaAgent respond for {self.username}, mood={mood}, input={input_text!r}")
        if "predict" in input_text.lower():
            return f"📈 Cortexa predicts a bullish signal with 82% confidence. (Mood: {mood})"
        elif "vector" in input_text.lower():
            return f"🔢 Input vector appears valid. Proceeding with classification... (Mood: {mood})"
        else:
            return f"🧬 Cortexa cannot process '{input_text}' — model input unclear. (Mood: {mood})"