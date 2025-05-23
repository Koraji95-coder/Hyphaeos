class AgentBase:
    def __init__(self, name: str):
        """
        Initializes the agent with a name and internal context.

        Args:
            name (str): Display name of the agent (e.g., "Daphne", "Bart")
        """
        self.name = name
        self.context = {}     # Agent-specific working memory or runtime flags
        self.active = True    # Whether the agent is active/enabled

    def ask(self, prompt: str) -> str:
        """
        Sends a prompt to the agent for processing.
        Must be implemented by subclasses.

        Args:
            prompt (str): The input string to process

        Returns:
            str: Agent-generated output or response
        """
        raise NotImplementedError("Agent must implement ask() method.")

    def respond(self, input_text: str) -> str:
        """
        Responds to a user message or input query.
        Each agent should customize this based on its role.

        Args:
            input_text (str): The user input

        Returns:
            str: Agent response string
        """
        raise NotImplementedError("Agent must implement respond().")

    def set_context(self, key: str, value):
        """
        Sets a value in the agent's internal runtime context.

        Args:
            key (str): The context key
            value: The value to store
        """
        self.context[key] = value

    def get_context(self, key: str):
        """
        Retrieves a value from the agent's internal context.

        Args:
            key (str): The context key to fetch

        Returns:
            Any or None: Stored context value
        """
        return self.context.get(key)

    def log(self, message: str):
        """
        Logs a message prefixed with the agent's name.
        Used for debug/output in shared agent pipelines.

        Args:
            message (str): The message to print
        """
        print(f"[{self.name}] {message}")