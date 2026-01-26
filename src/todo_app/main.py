"""
Entry point for the To-Do Console Application
Coordinates the application flow and user interaction loop
"""

# Handle both direct execution and module execution
try:
    # Try relative import first (when run as module)
    from .cli import ConsoleInterface
except ImportError:
    # Fallback to absolute import (when run directly)
    import sys
    import os
    # Add the src directory to the path so we can import the modules
    sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', '..'))
    from src.todo_app.cli import ConsoleInterface


def main():
    """
    Main function to run the To-Do Console Application
    Creates and runs the console interface
    """
    app = ConsoleInterface()
    app.run()


if __name__ == "__main__":
    main()