'use client';

import { useState } from 'react';
import { Slider } from './ui/slider';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import Dashboard from './dashboard';
import { ChartBarIcon, UserCircleIcon } from '@heroicons/react/24/solid';
import { DollarSign, DollarSignIcon } from 'lucide-react';
import { Input } from './ui/input';
import { Select, SelectItem, SelectContent, SelectTrigger, SelectValue, SelectGroup, SelectLabel } from './ui/select';

export function Simulator() {
    const [age, setAge] = useState([25]);
    const [firstPayment, setFirstPayment] = useState([2000]);
    const [monthlyPayment, setMonthlyPayment] = useState([100]);
    const [goal, setGoal] = useState([1000000]);
    return (
        <div className='w-full grid grid-cols-4 space-x-4'>
            <div className='col-span-1 space-y-4 grid grid-cols-1 grid-rows-5'>
                <Card className='col-span-1 row-span-2'>
                    <CardHeader>
                        <CardTitle className='flex'>
                            <UserCircleIcon className='h-6 w-6 mr-2' />
                            Mon projet
                        </CardTitle>
                    </CardHeader>
                    <CardContent className='space-y-8'>
                        <div className='space-y-4'>
                            <div className='flex items-center justify-between w-full'>
                                <h2>Mon age</h2>
                                <h2>{age} ans</h2>
                            </div>
                            <Slider defaultValue={[25]} max={66} min={18} step={1} value={age} onValueChange={(value) => setAge(value)} />
                        </div>
                        <div className='space-y-4'>
                            <div className='flex items-center justify-between w-full'>
                                <h2>Premier versement</h2>
                                <h2>{firstPayment} €</h2>
                            </div>
                            <Slider
                                defaultValue={[2000]}
                                max={50000}
                                min={500}
                                step={500}
                                value={firstPayment}
                                onValueChange={(value) => setFirstPayment(value)}
                            />
                        </div>
                        <div className='space-y-4'>
                            <div className='flex items-center justify-between w-full'>
                                <h2>Versement mensuel</h2>
                                <h2>{monthlyPayment} € / mois</h2>
                            </div>
                            <Slider
                                defaultValue={[100]}
                                max={2500}
                                min={50}
                                step={50}
                                value={monthlyPayment}
                                onValueChange={(value) => setMonthlyPayment(value)}
                            />
                        </div>
                    </CardContent>
                </Card>
                <Card className='col-span-1 row-span-1'>
                    <CardHeader>
                        <CardTitle className='flex'>
                            <DollarSign className='h-6 w-6 mr-2' />
                            Mon objectif
                        </CardTitle>
                    </CardHeader>
                    <CardContent className='space-y-8'>
                        <div className='space-y-4'>
                            <div className='flex items-center justify-between w-full'>
                                <h2>Montant</h2>
                                <h2>{goal}€</h2>
                            </div>
                            <Slider
                                defaultValue={[10000000]}
                                max={5000000}
                                min={100000}
                                step={1000}
                                value={goal}
                                onValueChange={(value) => setGoal(value)}
                            />
                        </div>
                        {/* TODO: Add a 3 step stepper */}
                        <Slider
                            defaultValue={[10000000]}
                            max={5000000}
                            min={100000}
                            step={1000}
                            value={goal}
                            onValueChange={(value) => setGoal(value)}
                        />
                    </CardContent>
                </Card>
                <Card className='col-span-1 row-span-2'>
                    <CardHeader>
                        <CardTitle className='flex'>
                            <DollarSign className='h-6 w-6 mr-2' />
                            Ma situation fiscale
                        </CardTitle>
                    </CardHeader>
                    <CardContent className='space-y-8'>
                        <div className='space-y-4'>
                            <Input placeholder='Revenue fiscale' />
                            <div className='w-full'>
                                <Select>
                                    <SelectTrigger className='w-full'>
                                        <SelectValue placeholder='Select a fruit' />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectLabel>Fruits</SelectLabel>
                                            <SelectItem value='apple'>Apple</SelectItem>
                                            <SelectItem value='banana'>Banana</SelectItem>
                                            <SelectItem value='blueberry'>Blueberry</SelectItem>
                                            <SelectItem value='grapes'>Grapes</SelectItem>
                                            <SelectItem value='pineapple'>Pineapple</SelectItem>
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </div>

                            <Input placeholder='Personne a charge' />
                            <Input placeholder='Revenue freelance' />
                            <Input placeholder='Revenue conjoit/e' />

                            <div>Ma TMI est de: 30</div>
                        </div>
                    </CardContent>
                </Card>
            </div>
            <Card className='col-span-3'>
                <CardHeader>
                    <CardTitle className='flex'>
                        <ChartBarIcon className='h-6 w-6 mr-2' />
                        Mes resultats
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <Dashboard />
                </CardContent>
            </Card>
        </div>
    );
}
