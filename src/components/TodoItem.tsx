'use client';

import { useTransition } from 'react';
import { toggleTodo, deleteTodo } from '@/app/actions';

interface Todo {
    id: string;
    title: string;
    completed: boolean;
}

export default function TodoItem({ todo }: { todo: Todo }) {
    const [isPending, startTransition] = useTransition();

    return (
        <li className="flex items-center justify-between p-4 bg-white dark:bg-zinc-800 rounded-lg shadow-sm border border-zinc-200 dark:border-zinc-700 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3">
                <input
                    id={`todo-${todo.id}`}
                    type="checkbox"
                    checked={todo.completed}
                    onChange={(e) => {
                        startTransition(() => {
                            toggleTodo(todo.id, e.target.checked);
                        });
                    }}
                    className="w-5 h-5 text-indigo-600 bg-zinc-100 border-zinc-300 rounded focus:ring-indigo-500 dark:focus:ring-indigo-600 dark:ring-offset-zinc-800 focus:ring-2 dark:bg-zinc-700 dark:border-zinc-600 cursor-pointer"
                />
                <label
                    htmlFor={`todo-${todo.id}`}
                    className={`text-lg cursor-pointer select-none transition-colors ${todo.completed ? 'line-through text-zinc-400 dark:text-zinc-500' : 'text-zinc-800 dark:text-zinc-100'
                        }`}
                >
                    {todo.title}
                </label>
            </div>
            <button
                onClick={() => {
                    startTransition(() => {
                        deleteTodo(todo.id);
                    });
                }}
                disabled={isPending}
                className="text-red-500 hover:text-red-700 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/40 p-2 rounded-md transition-colors disabled:opacity-50"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
            </button>
        </li>
    );
}
