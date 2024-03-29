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

    const [type, setType] = useState<'per' | 'vie' | 'scpi'>('per');

    const [year1, setYear1] = useState(0);
    const [year2, setYear2] = useState(0);
    const [year3, setYear3] = useState(0);
    const [year4, setYear4] = useState(0);
    const [year5, setYear5] = useState(0);
    const [year6, setYear6] = useState(0);
    const [year7, setYear7] = useState(0);
    const [year8, setYear8] = useState(0);
    const [year9, setYear9] = useState(0);
    const [year10, setYear10] = useState(0);

    const [inputtedTMI, setInputtedTMI] = useState(0);
    const [inputtedRentability, setInputtedRentability] = useState(0);

    const lifeExpectancy = 79.3;
    const yearsofInvestment = type === 'per' ? 67 - age[0] : age[0];
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
        const yearsofInvestment = type === 'per' ? 67 - age[0] : age[0];
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
        // Assuming "situation" and "peopleInCharge" are defined elsewhere in your component or logic
        if (situation === 'celibataire' || situation === 'divorce') {
            return 1 + (peopleInCharge > 0 ? 0.5 * peopleInCharge : 0);
        } else if (situation === 'marier/pacse') {
            // For married or PACS (civil partnership), the base quotient is 2 for the couple
            return 2 + (peopleInCharge > 0 ? 0.5 * peopleInCharge : 0);
        }

        // Default case if situation is not recognized
        return 1;
    };

    const calculTMI = () => {
        let quotientFamilial = calculateQuotientFamilial();
        let revenueWithQuotient = fiscalRevenue / quotientFamilial;

        // Adjust the fiscal brackets according to the latest tax scale if necessary
        if (revenueWithQuotient <= 11295) {
            return 0; // No tax
        } else if (revenueWithQuotient <= 28797) {
            return 11; // 11% tax
        } else if (revenueWithQuotient <= 82341) {
            return 30; // 30% tax
        } else if (revenueWithQuotient <= 177106) {
            return 41; // 41% tax
        } else {
            return 45; // 45% tax
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
                {type !== 'scpi' ? (
                    <>
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
                                        max={type === 'per' ? 66 : 20}
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
                                        max={type === 'per' ? 2500 : 2000}
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
                    </>
                ) : (
                    <Card className='col-span-1 row-span-1'>
                        <CardHeader>
                            <CardTitle className='flex'>
                                <Lightbulb className='h-6 w-6 mr-2' />
                                Mon projet
                            </CardTitle>
                        </CardHeader>
                        <CardContent className='space-y-8 mt-8'>
                            <div className='space-y-4'>
                                <div className='flex flex-col items-start justify-between w-full space-y-2'>
                                    <Label>TMI</Label>
                                    <Input placeholder='TMI' value={inputtedTMI} onChange={(e) => setInputtedTMI(Number(e.target.value))} />
                                </div>

                                <div className='flex flex-col items-start justify-between w-full space-y-2'>
                                    <Label>Rentabilité</Label>
                                    <Input
                                        placeholder='Rentabilité'
                                        value={inputtedRentability}
                                        onChange={(e) => setInputtedRentability(Number(e.target.value))}
                                    />
                                </div>

                                <div className='flex flex-col items-start justify-between w-full space-y-2 pt-8'>
                                    <Label>Investissement annuel</Label>
                                    <Input placeholder='Année 1' value={year1} onChange={(e) => setYear1(Number(e.target.value))} />
                                    <Input placeholder='Année 2' value={year2} onChange={(e) => setYear2(Number(e.target.value))} />
                                    <Input placeholder='Année 3' value={year3} onChange={(e) => setYear3(Number(e.target.value))} />
                                    <Input placeholder='Année 4' value={year4} onChange={(e) => setYear4(Number(e.target.value))} />
                                    <Input placeholder='Année 5' value={year5} onChange={(e) => setYear5(Number(e.target.value))} />
                                    <Input placeholder='Année 6' value={year6} onChange={(e) => setYear6(Number(e.target.value))} />
                                    <Input placeholder='Année 7' value={year7} onChange={(e) => setYear7(Number(e.target.value))} />
                                    <Input placeholder='Année 8' value={year8} onChange={(e) => setYear8(Number(e.target.value))} />
                                    <Input placeholder='Année 9' value={year9} onChange={(e) => setYear9(Number(e.target.value))} />
                                    <Input placeholder='Année 10' value={year10} onChange={(e) => setYear10(Number(e.target.value))} />
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
                                    <TabsTrigger value='scpi'>SCPI</TabsTrigger>
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
                        inputtedTMI={inputtedTMI}
                        inputtedRentability={inputtedRentability}
                        year1={year1}
                        year2={year2}
                        year3={year3}
                        year4={year4}
                        year5={year5}
                        year6={year6}
                        year7={year7}
                        year8={year8}
                        year9={year9}
                        year10={year10}
                    />
                </CardContent>
            </Card>
        </div>
    );
}
