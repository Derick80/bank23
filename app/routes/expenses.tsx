import type { LoaderArgs } from '@remix-run/node';
import { json } from '@remix-run/node'
import { prisma } from '~/server/prisma.server'

export async function loader({ request }: LoaderArgs) {

const expenses = await prisma.expense.findMany({
    where: {
        id: userId},
    })


  return json({ expenses});
}