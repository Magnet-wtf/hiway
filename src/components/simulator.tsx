'use client';

import { useState } from 'react';
import { Slider } from './ui/slider';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import Dashboard from './dashboard';
import { ChartBarIcon, UserCircleIcon } from '@heroicons/react/24/solid';
import { DollarSign, DollarSignIcon } from 'lucide-react';
import { Input } from './ui/input';
import { Select, SelectItem, SelectContent, SelectTrigger, SelectValue, SelectGroup, SelectLabel } from './ui/select';
import { Label } from './ui/label';

export function Simulator() {
    const [age, setAge] = useState([25]);
    const [firstPayment, setFirstPayment] = useState([2000]);
    const [monthlyPayment, setMonthlyPayment] = useState([100]);
    const [goal, setGoal] = useState([1000000]);

    const [peopleInCharge, setPeopleInCharge] = useState(0);
    const [situation, setSituation] = useState('celibataire');
    const [fiscalRevenue, setFiscalRevenue] = useState(0);
    const [freelanceRevenue, setFreelanceRevenue] = useState(0);
    const [conjointRevenue, setConjointRevenue] = useState(0);

    const [interest, setInterest] = useState(3);

    const lifeExpectancy = 79.3;
    const yearsofInvestment = 67 - age[0];
    const totalInvestment = monthlyPayment[0] * 12 * yearsofInvestment;
    const totalInvestmentWithInterest = totalInvestment * (1 + interest / 100) ** yearsofInvestment;
    const totalInterest = totalInvestmentWithInterest - totalInvestment;

    const composedInterest = (totalInvestmentWithInterest * 0.1) / 2;
    const possibleCapitalAt67 = totalInvestmentWithInterest + composedInterest + firstPayment[0];
    const monthlyRetirement = possibleCapitalAt67 / (lifeExpectancy - 67) / 12;

    const calculateQuotientFamilial = () => {
        if (situation === 'celibataire') {
            if (peopleInCharge === 1) {
                return 1.5;
            }
            return 1 + peopleInCharge;
        } else if (situation === 'marier/pacse') {
            if (peopleInCharge === 1) {
                return 2.5;
            }
            return 2 + peopleInCharge;
        }

        return 1;
    };

    const calculTMI = () => {
        if (situation === 'celibataire' && peopleInCharge === 0) {
            if (fiscalRevenue <= 10777) {
                return 0;
            } else if (fiscalRevenue <= 27478) {
                return 11;
            } else if (fiscalRevenue <= 78570) {
                return 30;
            } else if (fiscalRevenue <= 168994) {
                return 41;
            } else {
                return 45;
            }
        } else if (situation === 'marier/pacse') {
            const quotientFamilial = calculateQuotientFamilial();
            const revenueWithQuotient = fiscalRevenue / quotientFamilial;
            if (revenueWithQuotient <= 10777) {
                return 0;
            } else if (revenueWithQuotient <= 27478) {
                return 11;
            } else if (revenueWithQuotient <= 78570) {
                return 30;
            } else if (revenueWithQuotient <= 168994) {
                return 41;
            } else {
                return 45;
            }
        }
    };

    return (
        <div className='w-full grid grid-cols-4 space-x-4'>
            <div className='col-span-1 space-y-4 grid grid-cols-1 grid-rows-4'>
                <Card className='col-span-1 row-span-1'>
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
                                <h2>{new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(goal[0])}</h2>
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
                        {/* <Slider
                            defaultValue={[10000000]}
                            max={5000000}
                            min={100000}
                            step={1000}
                            value={goal}
                            onValueChange={(value) => setGoal(value)}
                        /> */}
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
                            <div className='space-y-2'>
                                <Label>Revenue fiscale</Label>
                                <Input
                                    placeholder='Revenue fiscale'
                                    value={fiscalRevenue}
                                    onChange={(e) => setFiscalRevenue(Number(e.target.value))}
                                />
                            </div>
                            <div className='w-full space-y-2'>
                                <Label>Situation</Label>
                                <Select onValueChange={(value) => setSituation(value)}>
                                    <SelectTrigger className='w-full'>
                                        <SelectValue placeholder='Selectionne ta situation' />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectLabel>Situation</SelectLabel>
                                            <SelectItem value='celibataire'>Celibataire</SelectItem>
                                            <SelectItem value='marier/pacse'>Marié/Pacsé</SelectItem>
                                            <SelectItem value='divorce'>Divorcé</SelectItem>
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className='space-y-2'>
                                <Label>Personne a charge</Label>
                                <Input
                                    placeholder='Personne a charge'
                                    value={peopleInCharge}
                                    onChange={(e) => setPeopleInCharge(Number(e.target.value))}
                                />
                            </div>

                            <div className='space-y-2'>
                                <Label>Revenue freelance</Label>
                                <Input
                                    placeholder='Revenue freelance'
                                    value={freelanceRevenue}
                                    onChange={(e) => setFreelanceRevenue(Number(e.target.value))}
                                />
                            </div>

                            <div className='space-y-2'>
                                <Label>Revenue conjoint/e</Label>
                                <Input
                                    placeholder='Revenue conjoit/e'
                                    value={conjointRevenue}
                                    onChange={(e) => setConjointRevenue(Number(e.target.value))}
                                />
                            </div>

                            <div>Ma TMI est de: {calculTMI()}</div>
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
                    <Dashboard
                        totalInvestment={totalInvestment}
                        composedInterest={composedInterest}
                        possibleCapital={possibleCapitalAt67}
                        monthlyRetirement={monthlyRetirement}
                        goal={goal[0]}
                    />
                </CardContent>
            </Card>
        </div>
    );
}