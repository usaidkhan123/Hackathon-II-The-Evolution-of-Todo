"""
Console interface for the To-Do Console Application
Handles user input, displays menus, and formats output
"""

from typing import Optional
from .core import TaskManager
from .models import Task


class ConsoleInterface:
    """
    Manages the console user interface for the to-do application
    Handles displaying menus, processing user input, and formatting output
    """

    def __init__(self):
        """Initialize the console interface with a task manager"""
        self.task_manager = TaskManager()

    def display_menu(self):
        """Display the main menu options to the user"""
        print("\n=== To-Do Console Application ===")
        print("1. Add a new task")
        print("2. View all tasks")
        print("3. Update a task")
        print("4. Delete a task")
        print("5. Toggle task completion status")
        print("6. Exit")
        print("=" * 33)

    def get_user_choice(self) -> int:
        """
        Get and validate user menu choice

        Returns:
            int: The user's menu choice (1-6), or -1 if invalid input
        """
        try:
            choice = int(input("Please select an option (1-6): "))
            if 1 <= choice <= 6:
                return choice
            else:
                print("Invalid option. Please select a number between 1 and 6.")
                return -1
        except ValueError:
            print("Invalid input. Please enter a number between 1 and 6.")
            return -1

    def add_task_ui(self):
        """Handle the user interface for adding a new task"""
        print("\n--- Add New Task ---")
        title = input("Enter task title: ").strip()

        # Optionally get description
        description_input = input("Enter task description (optional, press Enter to skip): ").strip()
        description = description_input if description_input else ""

        # Attempt to add the task
        task = self.task_manager.add_task(title, description)

        if task:
            print(f"✓ Task added successfully with ID {task.id}: '{task.title}'")
        else:
            print("✗ Failed to add task. Please ensure the title is not empty.")

    def view_tasks_ui(self):
        """Handle the user interface for viewing all tasks"""
        print("\n--- All Tasks ---")
        tasks = self.task_manager.get_all_tasks()

        if not tasks:
            print("No tasks found.")
        else:
            print(f"{'ID':<4} {'Status':<10} {'Title':<30} {'Description'}")
            print("-" * 60)
            for task in tasks:
                status = "Complete" if task.completed else "Incomplete"
                title = task.title[:27] + "..." if len(task.title) > 30 else task.title
                desc = task.description[:25] + "..." if len(task.description) > 25 else task.description
                print(f"{task.id:<4} {status:<10} {title:<30} {desc}")

    def update_task_ui(self):
        """Handle the user interface for updating a task"""
        print("\n--- Update Task ---")

        # Get task ID
        try:
            task_id = int(input("Enter the task ID to update: "))
        except ValueError:
            print("✗ Invalid task ID. Please enter a number.")
            return

        # Check if task exists
        existing_task = self.task_manager.get_task_by_id(task_id)
        if not existing_task:
            print(f"✗ Task with ID {task_id} not found.")
            return

        print(f"Updating task {task_id}: '{existing_task.title}'")

        # Get new title (or keep existing)
        new_title_input = input(f"Enter new title (current: '{existing_task.title}', press Enter to keep current): ").strip()
        new_title = new_title_input if new_title_input else None

        # Get new description (or keep existing)
        new_desc_input = input(f"Enter new description (current: '{existing_task.description}', press Enter to keep current): ").strip()
        new_description = new_desc_input if new_desc_input else None

        # Update the task
        success = self.task_manager.update_task(task_id, new_title, new_description)

        if success:
            print(f"✓ Task {task_id} updated successfully.")
        else:
            print("✗ Failed to update task. Please ensure the title is not empty.")

    def delete_task_ui(self):
        """Handle the user interface for deleting a task"""
        print("\n--- Delete Task ---")

        # Get task ID
        try:
            task_id = int(input("Enter the task ID to delete: "))
        except ValueError:
            print("✗ Invalid task ID. Please enter a number.")
            return

        # Confirm deletion
        existing_task = self.task_manager.get_task_by_id(task_id)
        if not existing_task:
            print(f"✗ Task with ID {task_id} not found.")
            return

        print(f"You are about to delete task {task_id}: '{existing_task.title}'")
        confirm = input("Are you sure? (y/N): ").lower().strip()

        if confirm in ['y', 'yes']:
            success = self.task_manager.delete_task(task_id)
            if success:
                print(f"✓ Task {task_id} deleted successfully.")
            else:
                print("✗ Failed to delete task.")
        else:
            print("Deletion cancelled.")

    def toggle_task_ui(self):
        """Handle the user interface for toggling task completion status"""
        print("\n--- Toggle Task Completion ---")

        # Get task ID
        try:
            task_id = int(input("Enter the task ID to toggle: "))
        except ValueError:
            print("✗ Invalid task ID. Please enter a number.")
            return

        # Toggle the task status
        success = self.task_manager.toggle_task_completion(task_id)

        if success:
            task = self.task_manager.get_task_by_id(task_id)
            if task:
                status = "completed" if task.completed else "incomplete"
                print(f"✓ Task {task_id} marked as {status}.")
        else:
            print(f"✗ Task with ID {task_id} not found.")

    def run(self):
        """Run the main application loop"""
        print("Welcome to the To-Do Console Application!")

        while True:
            self.display_menu()
            choice = self.get_user_choice()

            if choice == -1:
                # Invalid input, continue to next iteration
                continue

            if choice == 1:
                self.add_task_ui()
            elif choice == 2:
                self.view_tasks_ui()
            elif choice == 3:
                self.update_task_ui()
            elif choice == 4:
                self.delete_task_ui()
            elif choice == 5:
                self.toggle_task_ui()
            elif choice == 6:
                print("\nThank you for using the To-Do Console Application. Goodbye!")
                break

            # Pause before showing menu again
            input("\nPress Enter to continue...")