import { IncomeCategory, ExpenseCategory } from '@prisma/client'
import type { ActionArgs, LoaderArgs } from '@remix-run/node';
import { json } from '@remix-run/node'
import { Form, useLoaderData, useRouteLoaderData } from '@remix-run/react'
import { format } from 'date-fns'
import invariant from 'tiny-invariant'
import { isAuthenticated } from '~/server/auth/auth.server'
import { prisma } from '~/server/prisma.server'



export async function loader({request, params}:LoaderArgs){
    const {id} = params
    if(!id){
        return json({error: 'No id provided'})
    }

    const income = await prisma.income.findUnique({
        where:{
            id: Number(id)
        },
        include:{
            incomeCategory: true
        }
    })
    if(!income){
        return json({error: 'No income found'})
    }

    return json({income})
}


export async function action({request, params}:ActionArgs){
    const id = Number(params.id)
    if(!id){
        return json({error: 'No id provided'})
    }
    const user = await isAuthenticated(request)
    invariant(user, 'You must be logged in to edit an income')
    const formData = await request.formData()
    const source = formData.get('source')
    const amount = Number(formData.get('amount'))
    const dueDate = formData.get('dueDate')
    const title = formData.get('category')

if(typeof source !== 'string' || typeof amount !== 'number'  || typeof title !== 'string' ){
    return json({error: 'Invalid form data'})
}


            const income = await prisma.income.update({
                where:{
                    id,
    },
        data:{
            source,
            amount,
            dueDate: new Date(dueDate),
            incomeCategory:{
                connect:{
                    title

            }
        }
        }
    })
    return json({income})




}


export default function EditRoute(){
const data = useLoaderData<typeof loader>()

const routeData = useRouteLoaderData('root') as {iCategories: IncomeCategory[], eCategories: ExpenseCategory[], user: {id: number, email: string}}

const iCategories = routeData.iCategories as IncomeCategory[]
const [defaultOption] = data.income.incomeCategory.map((category) => category.title)
console.log(defaultOption, 'defaultOption');

    return(
        <div
         className='flex flex-col items-center mx-auto'
        >
        <h1 className='text-4xl font-bold'>Edit</h1>
<Form method='post'
className='flex flex-col w-full space-y-2 rounded-md shadow-md p-4'
>
    <label htmlFor='source'>Source</label>
    <input
    className='rounded-md shadow-sm border'
    defaultValue={data.income.source} type='text' name='source' id='source' />
    <label htmlFor='amount'>Amount</label>
    <input
    className='rounded-md shadow-sm border'
    defaultValue={data.income.amount}type='number' name='amount' id='amount' />
    <label htmlFor='dueDate'>Due Date</label>
    <input
    className='rounded-md shadow-sm border'
    type='date' name='dueDate' id='dueDate'

    defaultValue={format(new Date(data.income.dueDate), 'yyyy-MM-dd')}
    />
{data.income.incomeCategory && (
    <select name='category' id='category'>
       {iCategories.map((category) => {
        return(
            <option
            key={category.id}
            selected={category.title === defaultOption}
            >
                {category.title}
            </option>
        )
    })}
    </select>
)}


        <button type='submit'>Submit</button>
</Form>

<pre className='text-xs'>
    {JSON.stringify(data, null, 2)}
</pre>

        </div>
    )
}