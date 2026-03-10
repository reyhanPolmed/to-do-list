'use client';

import { useRef, useTransition } from 'react';
import { createTodo } from '@/app/actions';

export default function TodoForm() {
    const formRef = useRef<HTMLFormElement>(null);
    const [isPending, startTransition] = useTransition();

    const handleSubmit = (formData: FormData) => {
        startTransition(async () => {
            await createTodo(formData);
            formRef.current?.reset();
        });
    };

    return (
        <form ref={formRef} action={handleSubmit} className="w-full flex gap-2">
            <input
                type="text"
                name="title"
                required
                placeholder="What needs to be done?"
                className="flex-1 w-full px-4 py-3 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 placeholder-zinc-500 dark:placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-600 transition-all shadow-sm"
            />
            <button
                type="submit"
                disabled={isPending}
                className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-medium rounded-lg duration-200 transition-colors disabled:opacity-75 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
            >
                {isPending ? 'Adding...' : 'Add'}
            </button>
        </form>
    );
}
