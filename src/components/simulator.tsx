'use client';

import { use, useEffect, useState } from 'react';
import { Slider } from './ui/slider';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import Dashboard from './dashboard';
import { ChartBarIcon, UserCircleIcon } from '@heroicons/react/24/solid';
import { Briefcase, DollarSign, DollarSignIcon, Heart, Lightbulb, Rocket, Target } from 'lucide-react';
import { Input } from './ui/input';
import { Select, SelectItem, SelectContent, SelectTrigger, SelectValue, SelectGroup, SelectLabel } from './ui/select';
import { Label } from './ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { ModeToggle } from './mode-toggle';
import Image from 'next/image';

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

    const [type, setType] = useState<'per' | 'vie'>('per');

    const lifeExpectancy = 79.3;
    const yearsofInvestment = 67 - age[0];
    const monthlyInvestment = monthlyPayment[0] * 12;
    const totalInvestment = monthlyInvestment * yearsofInvestment + firstPayment[0];
    const interestRate = interest / 100; // converting percentage to a decimal

    const monthlyInterestRate = interest / 100 / 12; // Monthly interest rate
    const totalPeriods = yearsofInvestment * 12; // Total number of months

    const futureValueOfInitialInvestment = firstPayment[0] * Math.pow(1 + monthlyInterestRate, totalPeriods);
    const futureValueOfSeries = (monthlyPayment[0] * (Math.pow(1 + monthlyInterestRate, totalPeriods) - 1)) / monthlyInterestRate;

    const totalInvestmentWithInterest = futureValueOfInitialInvestment + futureValueOfSeries;
    const compoundedInterestValue = totalInvestmentWithInterest - (firstPayment[0] + totalInvestment);

    function calculateCompoundedInterestPerYear() {
        const yearsofInvestment = 67 - age[0];
        const monthlyInterestRate = interest / 100 / 12; // Monthly interest rate

        let compoundedInterestValues = [];

        for (let year = 1; year <= yearsofInvestment; year++) {
            const periods = year * 12;
            const futureValueOfSeries = (monthlyPayment[0] * (Math.pow(1 + monthlyInterestRate, periods) - 1)) / monthlyInterestRate;
            const futureValueOfInitialInvestment = firstPayment[0] * Math.pow(1 + monthlyInterestRate, periods);
            const totalInvestmentWithInterest = futureValueOfInitialInvestment + futureValueOfSeries;
            const compoundedInterest = totalInvestmentWithInterest - (firstPayment[0] + monthlyPayment[0] * 12 * year);
            compoundedInterestValues.push(compoundedInterest);
        }

        return compoundedInterestValues;
    }

    const possibleCapitalAt67 = totalInvestment + calculateCompoundedInterestPerYear()[calculateCompoundedInterestPerYear().length - 1];
    const monthsOfRetirement = (lifeExpectancy - 67) * 12; // converting years to months
    const monthlyRetirement = possibleCapitalAt67 / monthsOfRetirement;

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

    useEffect(() => {
        if (type === 'per') {
            setAge([25]);
        } else {
            setAge([15]);
        }
    }, [type]);

    return (
        <div className='w-full grid grid-cols-4 space-x-4'>
            <div className='col-span-1 space-y-4 grid grid-cols-1 grid-rows-8'>
                <Card className='col-span-1 row-span-1'>
                    <CardHeader>
                        <CardTitle className='flex'>
                            <Lightbulb className='h-6 w-6 mr-2' />
                            Mon projet
                        </CardTitle>
                    </CardHeader>
                    <CardContent className='space-y-8'>
                        <div className='space-y-4'>
                            <div className='flex items-center justify-between w-full'>
                                <h2>{type === 'per' ? 'Mon âge' : "Temps d'investissement"}</h2>
                                <h2>{age} ans</h2>
                            </div>
                            <Slider
                                defaultValue={type === 'per' ? [25] : [15]}
                                max={66}
                                min={type === 'per' ? 18 : 0}
                                step={1}
                                value={age}
                                onValueChange={(value) => setAge(value)}
                            />
                        </div>
                        <div className='space-y-4'>
                            <div className='flex items-center justify-between w-full'>
                                <h2>Premier versement</h2>
                                <h2>{firstPayment} €</h2>
                            </div>
                            <Slider
                                defaultValue={[2000]}
                                max={50000}
                                min={type === 'per' ? 500 : 0}
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
                            <Rocket className='h-6 w-6 mr-2' />
                            Mon objectif
                        </CardTitle>
                    </CardHeader>
                    <CardContent className='space-y-8'>
                        <div className='space-y-4'>
                            <div className='flex items-center justify-between w-full'>
                                <h2>Montant</h2>
                                <h2>
                                    {new Intl.NumberFormat('de-DE', {
                                        style: 'currency',
                                        currency: 'EUR',
                                        maximumFractionDigits: 0,
                                    }).format(goal[0])}
                                </h2>
                            </div>
                            <Slider
                                defaultValue={[10000000]}
                                max={1500000}
                                min={100000}
                                step={100000}
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
                {type === 'per' && (
                    <Card className='col-span-1 row-span-2'>
                        <CardHeader>
                            <CardTitle className='flex'>
                                <Heart className='h-6 w-6 mr-2' />
                                Ma situation fiscale
                            </CardTitle>
                        </CardHeader>
                        <CardContent className='space-y-8'>
                            <div className='space-y-4'>
                                <div className='space-y-2'>
                                    <Label>Revenu fiscal</Label>
                                    <Input
                                        placeholder='Revenu fiscal'
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
                                    <Label>Personne(s) a charge</Label>
                                    <Input
                                        placeholder='Personne(s) a charge'
                                        value={peopleInCharge}
                                        onChange={(e) => setPeopleInCharge(Number(e.target.value))}
                                    />
                                </div>

                                <div className='text-2xl font-bold pt-8 flex items-center justify-center'>
                                    Votre TMI est de
                                    <div className='dark:bg-slate-800 bg-slate-300 rounded-xl p-4 ml-3'>{calculTMI()}%</div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
            <Card className='col-span-3'>
                <CardHeader>
                    <CardTitle className='flex w-full justify-between items-center'>
                        <div className='flex items-center'>
                            <Image src='/hiway.svg' width={42} height={42} alt='Hiway' className='mr-4' />
                            Mes résultats
                            <Tabs defaultValue={type} onValueChange={(value) => setType(value as 'per' | 'vie')} className='ml-8'>
                                <TabsList>
                                    <TabsTrigger value='per'>PER</TabsTrigger>
                                    <TabsTrigger value='vie'>Assurance Vie</TabsTrigger>
                                </TabsList>
                            </Tabs>
                        </div>

                        <div className='flex space-x-2'>
                            <Tabs defaultValue={interest.toString()} onValueChange={(value) => setInterest(Number(value))}>
                                <TabsList>
                                    <TabsTrigger value='3'>Prudent</TabsTrigger>
                                    <TabsTrigger value='4.5'>Équilibré</TabsTrigger>
                                    <TabsTrigger value='6.5'>Dynamique</TabsTrigger>
                                </TabsList>
                            </Tabs>

                            <ModeToggle />
                        </div>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <Dashboard
                        totalInvestment={totalInvestment}
                        composedInterest={compoundedInterestValue}
                        possibleCapital={possibleCapitalAt67}
                        monthlyRetirement={monthlyRetirement}
                        goal={goal[0]}
                        yearsofInvestment={yearsofInvestment}
                        firstPayment={firstPayment[0]}
                        interestYearOverYear={calculateCompoundedInterestPerYear()}
                        interest={interest}
                        tmi={calculTMI() || 0}
                        type={type}
                    />
                </CardContent>
            </Card>
        </div>
    );
}
