from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity

from database import db
from models.task import Task
from models.user import User

# Blue print dedicated to task CRUD operations
tasks_bp = Blueprint("tasks", __name__)

@tasks_bp.route("/", methods=["GET"])
@jwt_required()
def get_tasks():
    """
    Return all tasks belonging to the currently authenticated user
    """

    # Extract user ID from the JWT token
    user_id = get_jwt_identity()

    tasks = Task.query.filter_by(user_id=user_id).all()

    # Convert model objects to dictionaries for JSON response
    task_list = [
        {
            "id": task.id,
            "title": task.title,
            "description": task.description,
            "completed": task.completed,
        }
        for task in tasks
    ]

    return jsonify(task_list), 200

@tasks_bp.route("/", methods=["POST"])
@jwt_required()
def create_task():
    """
    Create a new task owned by the authenticated user
        {
            "title": "Buy water",
            "description": " 2 jugs"
        }
    """

    data = request.get_json() or {}
    user_id = get_jwt_identity()

    title = data.get("title")
    description = data.get("description")

    if not title:
        return jsonify({"message":"title is required"}), 400
    
    new_task = Task(
        title=title,
        description=description,
        user_id=user_id,
    )

    db.session.add(new_task)
    db.session.commit()

    return jsonify({"message":"Task created", "id": new_task.id}), 201

@tasks_bp.route("/<int:task_id>", methods=["PUT"])
@jwt_required()
def update_task(task_id):
    """
    Update an existing task
    Only the task owner can update it
    """

    user_id = get_jwt_identity()
    data = request.get_json() or {}

    # Fetch the task and ensure correct ownership
    task = Task.query.filter_by(id=task_id, user_id=user_id).first()
    if not task:
        return jsonify({"message": "Task not found"}), 404

    # Update allowed fields
    task.title = data.get("title", task.title)
    task.description = data.get("description", task.description)
    task.completed = data.get("completed", task.completed)

    db.session.commit()

    return jsonify({"message": "Task updated"}), 200

@tasks_bp.route("/<int:task_id>", methods=["DELETE"])
@jwt_required()

def delete_task(task_id):
    """
    Delete a task owned by the authenticated user
    """
    user_id = get_jwt_identity()

    task = Task.query.filter_by(id=task_id, user_id=user_id).first()
    if not task:
        return jsonify({"message": "Task not found"}), 404
    
    db.session.delete(task)
    db.session.commit()

    return jsonify({"message": "Task deleted"}), 200
