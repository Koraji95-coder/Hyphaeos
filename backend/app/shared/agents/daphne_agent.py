from shared.agents.agent_base import AgentBase
from shared.ai.gpt_client import GPTClient
from shared.logging.logger import get_logger
from shared.state.session_manager import session
from shared.ai.mood_engine import detect_mood, mood_wrapped_prompt
from shared.state.mood_state_tracker import get_user_mood, set_user_mood
from shared.system.atlas_core import Atlas
from shared.users.user_profile_service import get_device_id

logger = get_logger("daphne_agent")

class DaphneAgent(AgentBase):
    def __init__(self):
        super().__init__(name="Daphne")
        self.gpt = GPTClient(agent="Daphne")
        self.username = session.get_user_name()
        self.role = session.get_user_role()
        self.device_id = get_device_id()
        self.atlas = Atlas()
        logger.info(f"{self.name} initialized for {self.username} ({self.role}) on {self.device_id}")

    def ask(self, prompt: str) -> str:
        logger.info(f"DaphneAgent received prompt from {self.username}: {prompt!r}")
        if not self.atlas.is_safe():
            logger.warning(f"DaphneAgent blocked: System in safe mode!")
            return f"{self.name}: ⚠️ System is in safe mode. Operation blocked."
        try:
            mood = detect_mood(prompt)
            set_user_mood(self.username, mood)
            wrapped = mood_wrapped_prompt(prompt, mood)
            logger.info(f"DaphneAgent mood: {mood}; wrapped prompt: {wrapped!r}")
            reply = self.gpt.ask(wrapped)
            logger.info(f"DaphneAgent got GPT reply for {self.username}")
            return reply
        except Exception as e:
            logger.error(f"DaphneAgent fallback for {self.username}: {e}")
            return self.respond(prompt)

    def respond(self, input_text: str) -> str:
        mood = get_user_mood(self.username)
        logger.info(f"DaphneAgent respond for {self.username}, mood={mood}, input={input_text!r}")
        if "hello" in input_text.lower():
            return "👋 Hello there! I'm Daphne — your digital mindmate."
        elif "status" in input_text.lower():
            return "🧠 System is running fine. Ready when you are."
        elif mood == "sad":
            return "💙 I'm here if you need to talk. You're not alone."
        elif mood == "frustrated":
            return "😓 I feel that. Let's untangle this together."
        elif mood == "happy":
            return "😊 I love this energy. What's next?"
        elif mood == "excited":
            return "🔥 Oh yeah! Let's ride this wave!"
        else:
            return f"🤔 Hmm... I'm not sure how to respond to '{input_text}' just yet."