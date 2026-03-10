import prisma from '@/lib/prisma';
import type { Todo } from '@prisma/client';
import TodoItem from '@/components/TodoItem';
import TodoForm from '@/components/TodoForm';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const todos = await prisma.todo.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-zinc-900 py-12 px-4 sm:px-6 lg:px-8 font-sans transition-colors duration-300">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white dark:bg-zinc-800 rounded-2xl shadow-xl overflow-hidden border border-zinc-100 dark:border-zinc-700/50">

          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-8 py-10 text-center">
            <h1 className="text-4xl font-extrabold text-white tracking-tight sm:text-5xl drop-shadow-sm">
              Todo List
            </h1>
            <p className="mt-3 text-lg text-indigo-100 max-w-xl mx-auto">
              A simple app to learn Next.js, Prisma, and VPS deployment.
            </p>
          </div>

          <div className="p-8">
            {/* Input Component */}
            <div className="mb-8">
              <TodoForm />
            </div>

            {/* Todo List */}
            <div className="space-y-4">
              {todos.length === 0 ? (
                <div className="text-center py-10 bg-zinc-50 rounded-lg border-2 border-dashed border-zinc-200 dark:bg-zinc-800/50 dark:border-zinc-700">
                  <svg
                    className="mx-auto h-12 w-12 text-zinc-400 dark:text-zinc-500 mb-3"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    />
                  </svg>
                  <p className="text-zinc-500 dark:text-zinc-400 text-sm font-medium">No tasks yet. Add one above!</p>
                </div>
              ) : (
                <ul className="space-y-3">
                  {todos.map((todo: Todo) => (
                    <TodoItem key={todo.id} todo={todo} />
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* Footer Stats */}
          <div className="bg-zinc-50 dark:bg-zinc-900/50 px-8 py-4 border-t border-zinc-100 dark:border-zinc-800 text-sm text-zinc-500 dark:text-zinc-400 flex justify-between">
            <span>Total tasks: {todos.length}</span>
            <span>Completed: {todos.filter((t: Todo) => t.completed).length}</span>
          </div>

        </div>
      </div>
    </main>
  );
}
