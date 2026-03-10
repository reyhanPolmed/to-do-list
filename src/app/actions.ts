'use server';

import { revalidatePath } from 'next/cache';
import prisma from '@/lib/prisma';

export async function createTodo(formData: FormData) {
    const title = formData.get('title') as string;
    if (!title || title.trim() === '') return;

    await prisma.todo.create({
        data: {
            title,
        },
    });

    revalidatePath('/');
}

export async function toggleTodo(id: string, completed: boolean) {
    await prisma.todo.update({
        where: { id },
        data: { completed },
    });

    revalidatePath('/');
}

export async function deleteTodo(id: string) {
    await prisma.todo.delete({
        where: { id },
    });

    revalidatePath('/');
}
