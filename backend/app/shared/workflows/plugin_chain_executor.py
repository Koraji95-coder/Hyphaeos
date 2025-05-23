from shared.workflows.plugin_executor import execute_plugin
from shared.state.session_manager import session

def execute_plugin_chain(chain_steps: list) -> list:
    """
    Executes a sequence of plugin steps.

    Args:
        chain_steps (list): [{ plugin: str, input: str }]

    Returns:
        list: plugin execution results
    """
    results = []

    for step in chain_steps:
        plugin_name = step.get("plugin")
        input_text = step.get("input")

        result = execute_plugin(plugin_name, input_text)
        results.append(result)

    # Store in session memory
    session.get_memory()["last_plugin_chain"] = results
    return results