import { MinusCircledIcon, PlusCircledIcon } from '@radix-ui/react-icons'
import type { LoaderArgs } from '@remix-run/node'
import { json, redirect } from '@remix-run/node'
import { NavLink, useLoaderData } from '@remix-run/react'
import React from 'react'
import { BandChart, BandContainer } from '~/compoonents/bandchart'
import NewCard from '~/compoonents/create-card'
import ItemCard from '~/compoonents/item-card'
import Tooltip from '~/compoonents/tooltip'
import { isAuthenticated } from '~/server/auth/auth.server'
import { getCurrentExpenses } from '~/server/expense.server'
import { categoriesAndPercentage } from '~/server/functions.server'
import { getCurrentIncomes } from '~/server/incomes.server'
import type {
    BandContainerObjectProps,
    CorrectedIncome,
    Expense,
    Income
} from '~/types/types'

export async function loader ({ request }: LoaderArgs) {
    const user = await isAuthenticated(request)

    const incomes = await getCurrentIncomes(user?.id)
    const expenses = await getCurrentExpenses(user?.id)

    // map over the incomes to return the new object

    const limitedIncome = incomes.map((income) => {
        return {
            amount: income.amount,
            category: income.categories.map((category) => category.title).toString()
        }
    })

    // reduce the categories to a string and then map over the expenses to return the new object
    const limitedExpenses = expenses.map((expense) => {
        return {
            amount: expense.amount,
            category: expense.categories.map((category) => category.title).toString()
        }
    })

    // Set up expenses and Icome by category and percentage for band chart

    const eByCandP = categoriesAndPercentage(limitedExpenses)
    const iByCandP = categoriesAndPercentage(limitedIncome)

    return json({ incomes, expenses, eByCandP, iByCandP })
}

export default function Index () {
    const data = useLoaderData<{
        incomes: Expense[]
        expenses: Income[]
        eByCandP: BandContainerObjectProps[]
        iByCandP: BandContainerObjectProps[]
    }>()

    const iSubTotal = data.incomes.reduce(
        (acc: number, income: { amount: number }) => acc + income.amount,
        0
    )
    const eSubTotal = data.expenses.reduce(
        (acc: number, expense: { amount: number }) => acc + expense.amount,
        0
    )

    const difference = iSubTotal - eSubTotal
    console.log(difference, 'difference')

    return (
        <div className='flex flex-col py-2 text-center'>
            <Summary
                iSubTotal={ iSubTotal }
                eSubTotal={ eSubTotal }
                difference={ difference }
            />

            {/* Expenses */ }
            <div className='flex w-full grow flex-col justify-center gap-5 md:flex-row'>
                <div className='flex w-[350px] flex-col items-center border-2 py-2 text-center md:w-[550px]'>
                    <h1 className='text-4xl font-bold'>Expenses</h1>
                    <NavLink to='/new' className='flex items-center gap-2'>
                        <Tooltip message='Create'>
                            <div className='flex items-center gap-2'>
                                <p>New</p>
                                <PlusCircledIcon />
                            </div>
                        </Tooltip>
                    </NavLink>
                    <div className='flex flex-col items-center   py-2 text-center'>
                        <h3 className='mb-4 text-xl font-bold'>
                            Expenses by Category and Percentage
                        </h3>
                        <BandContainer>
                            { data.eByCandP.map((item) => {
                                return (
                                    <BandChart
                                        key={ item.category }
                                        { ...item }
                                        bgFill={ item.fills }
                                        itemWidth={ item.percentage }
                                    />
                                )
                            }) }
                        </BandContainer>
                    </div>
                    <ItemCard data={ data.expenses } type='expense' />
                </div>

                {/* incomes */ }
                <div className='flex w-[350px] flex-col items-center border-2 py-2 text-center md:w-[550px]'>
                    { ' ' }
                    <h1 className='text-4xl font-bold'>Incomes</h1>
                    <NavLink to='/new' className='flex items-center gap-2'>
                        <Tooltip message='Create'>
                            <div className='flex items-center gap-2'>
                                <p>New</p>
                                <PlusCircledIcon />
                            </div>
                        </Tooltip>
                    </NavLink>
                    <div className='flex flex-col items-center   py-2 text-center'>
                        <h3 className='mb-5 text-2xl font-bold'>
                            Expenses by Category and Percentage
                        </h3>
                        <BandContainer>
                            { data.iByCandP.map((item: BandContainerObjectProps) => {
                                return (
                                    <BandChart
                                        key={ item.category }
                                        { ...item }
                                        category={ item.category }
                                        bgFill={ item.fills }
                                        itemWidth={ item.percentage }
                                    />
                                )
                            }) }
                        </BandContainer>
                    </div>
                    <ItemCard data={ data.incomes } type='income' />
                </div>
            </div>
        </div>
    )
}

function Summary ({
    eSubTotal,
    iSubTotal,
    difference
}: {
    eSubTotal: number
    iSubTotal: number
    difference: number
}) {
    return (
        <>
            <div className='flex flex-col items-center  pb-2 text-center'>
                <div className='flex items-center gap-2'>
                    <h1 className='text-2xl font-bold'>Expenses</h1>
                    { eSubTotal }
                    <h1 className='text-2xl font-bold'>Incomes</h1>
                    <p className='text-xs'>${ iSubTotal }</p>
                </div>

                { eSubTotal > iSubTotal ? (
                    <h1 className='text-4xl font-bold'>
                        You are over budget by ${ difference }
                    </h1>
                ) : (
                    <h1 className='text-4xl font-bold'>
                        You are under budget by ${ difference }
                    </h1>
                ) }
            </div>
        </>
    )
}
