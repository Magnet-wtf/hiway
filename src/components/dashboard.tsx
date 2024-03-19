'use client';

import { InformationCircleIcon } from '@heroicons/react/24/solid';

import {
    AreaChart,
    BadgeDelta,
    BarChart,
    Card,
    Color,
    DeltaType,
    Flex,
    Grid,
    Icon,
    Metric,
    MultiSelect,
    MultiSelectItem,
    ProgressBar,
    Select,
    SelectItem,
    Tab,
    TabGroup,
    TabList,
    TabPanel,
    TabPanels,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeaderCell,
    TableRow,
    Text,
    Title,
} from '@tremor/react';

type Kpi = {
    title: string;
    metric: string;
    progress: number;
    target: string;
    delta: string;
    deltaType: DeltaType;
};

import { useState } from 'react';

const usNumberformatter = (number: number, decimals = 0) =>
    Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(number).toString();

const formatters: { [key: string]: any } = {
    TotalInvestment: (number: number) => `$ ${usNumberformatter(number)}`,
    ComposedInterest: (number: number) => `$ ${usNumberformatter(number)}`,
};

const Kpis = {
    TotalInvestment: 'Total Investment',
    ComposedInterest: 'Composed Interest',
};

const kpiList = [Kpis.TotalInvestment, Kpis.ComposedInterest];

export type DailyPerformance = {
    date: string;
    'Versements cumulés': number;
    'Intérêt cumulés': number;
};

export type SalesPerson = {
    name: string;
    leads: number;
    sales: string;
    quota: string;
    variance: string;
    region: string;
    status: string;
};

export const salesPeople: SalesPerson[] = [
    {
        name: 'Peter Doe',
        leads: 45,
        sales: '1,000,000',
        quota: '1,200,000',
        variance: 'low',
        region: 'Region A',
        status: 'overperforming',
    },
    {
        name: 'Lena Whitehouse',
        leads: 35,
        sales: '900,000',
        quota: '1,000,000',
        variance: 'low',
        region: 'Region B',
        status: 'average',
    },
    {
        name: 'Phil Less',
        leads: 52,
        sales: '930,000',
        quota: '1,000,000',
        variance: 'medium',
        region: 'Region C',
        status: 'underperforming',
    },
    {
        name: 'John Camper',
        leads: 22,
        sales: '390,000',
        quota: '250,000',
        variance: 'low',
        region: 'Region A',
        status: 'overperforming',
    },
    {
        name: 'Max Balmoore',
        leads: 49,
        sales: '860,000',
        quota: '750,000',
        variance: 'low',
        region: 'Region B',
        status: 'overperforming',
    },
];

const deltaTypes: { [key: string]: DeltaType } = {
    average: 'unchanged',
    overperforming: 'moderateIncrease',
    underperforming: 'moderateDecrease',
};

interface InvestmentYearData {
    year: number;
    annualInvestment: number;
    cumulativeInvestment: number;
    grossInterest: number;
    netInterest: number;
    cumulativeNetInterest: number;
    totalValue: number;
}

function calculateInvestmentData(annualInvestment: number[], tmi: number, rentability: number, years: number): InvestmentYearData[] {
    let investmentData: InvestmentYearData[] = [];
    let cumulativeInvestment = 0;
    let cumulativeNetInterest = 0;

    for (let i = 0; i < years; i++) {
        console.log('Investissement Annuel', annualInvestment);
        // Calculate investment for the year
        if (i === 0) {
            cumulativeInvestment += annualInvestment[i];
        } else {
            cumulativeInvestment = investmentData[i - 1].totalValue + annualInvestment[i];
        }

        console.log('Versements cumulés', cumulativeInvestment);

        // Calculate gross interest for previous year's investment
        let grossInterest = cumulativeInvestment * (rentability / 100);

        console.log('Intérêts bruts', grossInterest);

        // Calculate net interest after TMI
        let netInterest = grossInterest - grossInterest * 0.172 - (grossInterest * tmi) / 100;

        console.log('Intérêts nets', netInterest);

        // Update cumulative net interest
        cumulativeNetInterest += netInterest;

        console.log('Intérêts cumulés nets', cumulativeNetInterest);

        // Calculate total value at the end of the year
        cumulativeInvestment += i === 0 ? netInterest : 0;
        let totalValue = i === 0 ? cumulativeInvestment : grossInterest + cumulativeInvestment;

        console.log('Valeur totale', totalValue);

        investmentData.push({
            year: new Date().getFullYear() + i,
            annualInvestment: annualInvestment[i],
            cumulativeInvestment,
            grossInterest,
            netInterest,
            cumulativeNetInterest,
            totalValue,
        });
    }

    return investmentData;
}

export default function Dashboard({
    totalInvestment,
    composedInterest,
    possibleCapital,
    monthlyRetirement,
    goal,
    yearsofInvestment,
    firstPayment,
    interestYearOverYear,
    interest,
    tmi,
    type,
    inputtedTMI,
    inputtedRentability,
    year1,
    year2,
    year3,
    year4,
    year5,
    year6,
    year7,
    year8,
    year9,
    year10,
}: {
    totalInvestment: number;
    composedInterest: number;
    possibleCapital: number;
    monthlyRetirement: number;
    goal: number;
    yearsofInvestment: number;
    firstPayment: number;
    interestYearOverYear: number[];
    interest: number;
    tmi: number;
    type: 'per' | 'vie' | 'scpi';
    inputtedTMI: number;
    inputtedRentability: number;
    year1: number;
    year2: number;
    year3: number;
    year4: number;
    year5: number;
    year6: number;
    year7: number;
    year8: number;
    year9: number;
    year10: number;
}) {
    const [selectedIndex, setSelectedIndex] = useState(0);
    const selectedKpi = kpiList[selectedIndex];
    const [selectedStatus, setSelectedStatus] = useState('all');
    const [selectedNames, setSelectedNames] = useState<string[]>([]);

    const isSalesPersonSelected = (salesPerson: SalesPerson) =>
        (salesPerson.status === selectedStatus || selectedStatus === 'all') &&
        (selectedNames.includes(salesPerson.name) || selectedNames.length === 0);

    const totalInvestment10Years = [year1, year2, year3, year4, year5, year6, year7, year8, year9, year10];

    const investmentYears = calculateInvestmentData(totalInvestment10Years, inputtedTMI, inputtedRentability, 10);
    const totalCalculatedNetInterest = investmentYears.reduce((acc, year) => acc + year.netInterest, 0);
    const totalCalculatedTotalValue = investmentYears[investmentYears.length - 1].totalValue;
    const totalCalculatedCumulativeNetInterest = investmentYears[investmentYears.length - 1].cumulativeNetInterest;
    const totalCalculatedCumulativeInvestment = investmentYears[investmentYears.length - 1].cumulativeInvestment;

    const kpiDataFirstLine: Kpi[] = [
        {
            title: `CAPITAL ESPÉRÉ${type === 'per' ? ' À 67 ANS' : ''}`,
            metric: `${new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(
                possibleCapital,
            )}`,
            progress: ((possibleCapital / goal) * 100).toFixed(1) as unknown as number,
            target: `${new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(goal)}`,
            delta: '10.1%',
            deltaType: 'moderateIncrease',
        },
        {
            title: 'SOIT UN REVENU COMPLÉMENTAIRE DE',
            metric: `${new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(
                monthlyRetirement,
            )} / mois`,
            progress: 36.5,
            target: '$ 125,000',
            delta: '23.9%',
            deltaType: 'increase',
        },
    ];

    const kpiSCPIFirstLine: Kpi[] = [
        {
            title: `VERSEMENTS + REINVESTISSENTS TOTAUX`,
            metric: `${new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(
                totalCalculatedCumulativeInvestment,
            )}`,
            progress: ((possibleCapital / goal) * 100).toFixed(1) as unknown as number,
            target: `${new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(goal)}`,
            delta: '10.1%',
            deltaType: 'moderateIncrease',
        },
        {
            title: 'VALEUR TOTALE',
            metric: `${new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(
                totalCalculatedTotalValue,
            )}`,
            progress: 36.5,
            target: '$ 125,000',
            delta: '23.9%',
            deltaType: 'increase',
        },
    ];

    const kpiSCPISecondLine: Kpi[] = [
        {
            title: 'INTERES NETS',
            metric: `${new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(
                totalCalculatedCumulativeNetInterest,
            )}`,
            progress: 53.6,
            target: '2,000',
            delta: '10.1%',
            deltaType: 'moderateDecrease',
        },
    ];

    const annualOptimization = (((totalInvestment - firstPayment) / yearsofInvestment) * tmi) / 100;
    const totalOptimization = (totalInvestment - firstPayment) * (tmi / 100);
    const kpiDataThirdLine: Kpi[] = [
        {
            title: 'OPTIMISATION ANNUELLE',
            metric: `${new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(
                annualOptimization,
            )}`,
            progress: ((possibleCapital / goal) * 100).toFixed(1) as unknown as number,
            target: `${new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(goal)}`,
            delta: '10.1%',
            deltaType: 'moderateIncrease',
        },
        {
            title: 'OPTIMISATION TOTALE',
            metric: `${new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(
                totalOptimization,
            )}`,
            progress: 36.5,
            target: '$ 125,000',
            delta: '23.9%',
            deltaType: 'increase',
        },
    ];
    const kpiDataSecondLine: Kpi[] = [
        {
            title: 'VERSEMENTS TOTAUX',
            metric: `${new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(
                totalInvestment,
            )}`,
            progress: 53.6,
            target: '2,000',
            delta: '10.1%',
            deltaType: 'moderateDecrease',
        },
        {
            title: 'INTÉRÊTS COMPOSÉS',
            metric: `${new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(
                Number(interestYearOverYear[yearsofInvestment - 1]),
            )}`,
            progress: 53.6,
            target: '2,000',
            delta: '10.1%',
            deltaType: 'moderateDecrease',
        },
        {
            title: 'PERFORMANCE ESPÉRÉE',
            metric: `${interest}% / an`,
            progress: 53.6,
            target: '2,000',
            delta: '10.1%',
            deltaType: 'moderateDecrease',
        },
    ];

    function buildPerformanceFromTotalInvestmentAndComposedInterestYearOverYear() {
        const performance: DailyPerformance[] = [];
        for (let i = 0; i < yearsofInvestment; i++) {
            performance.push({
                date: `${i + 1}`,
                'Versements cumulés': (totalInvestment / yearsofInvestment) * (i + 1),
                'Intérêt cumulés': interestYearOverYear[i],
            });
        }
        return performance;
    }

    function buildSCPIPerformanceFromTotalInvestmentAndComposedInterestYearOverYear() {
        const performance: DailyPerformance[] = [];

        const interestYearOverYear = calculateInvestmentData(totalInvestment10Years, inputtedTMI, inputtedRentability, 10);
        for (let i = 0; i < 10; i++) {
            performance.push({
                date: `${i + 1}`,
                'Versements cumulés': interestYearOverYear[i].cumulativeInvestment,
                'Intérêt cumulés': interestYearOverYear[i].cumulativeNetInterest,
            });
        }
        return performance;
    }

    const areaChartArgs = {
        className: 'mt-5 h-96',
        data: buildPerformanceFromTotalInvestmentAndComposedInterestYearOverYear(),
        index: 'date',
        categories: ['Versements cumulés', 'Intérêt cumulés'],
        colors: ['#0d577c', '#fec802'],
        showLegend: false,
        valueFormatter: (number: number) => `${usNumberformatter(number)}`,
        yAxisWidth: 120,
    };

    const scpiAreaChartArgs = {
        className: 'mt-5 h-96',
        data: buildSCPIPerformanceFromTotalInvestmentAndComposedInterestYearOverYear(),
        index: 'date',
        categories: ['Versements cumulés', 'Intérêt cumulés'],
        colors: ['#0d577c', '#fec802'],
        showLegend: false,
        valueFormatter: (number: number) => `${usNumberformatter(number)}`,
        yAxisWidth: 120,
    };

    return (
        <main>
            <TabGroup className='mt-6'>
                <TabPanels>
                    {type === 'per' || type === 'vie' ? (
                        <TabPanel>
                            <Grid numItemsMd={2} numItemsLg={2} className='mt-6 gap-6'>
                                {type === 'per' ? (
                                    <>
                                        {kpiDataFirstLine.map((item, index) => (
                                            <Card key={item.title} className='flex flex-col justify-center'>
                                                <Flex
                                                    alignItems={index === 0 ? 'start' : 'center'}
                                                    justifyContent={index === 0 ? 'start' : 'center'}
                                                >
                                                    <div className={`truncate space-y-2 ${index === 1 && 'text-center'}`}>
                                                        <Text>{item.title}</Text>
                                                        <Metric className='truncate text-5xl'>{item.metric}</Metric>
                                                    </div>
                                                </Flex>
                                                {index === 0 && (
                                                    <>
                                                        <Flex className='mt-4 space-x-2'>
                                                            <Text className='truncate'>{`${item.progress}%`}</Text>
                                                            <Text className='truncate'>{item.target}</Text>
                                                        </Flex>
                                                        <ProgressBar value={item.progress} className='mt-2' color={'#0d577c' as Color} />
                                                    </>
                                                )}
                                            </Card>
                                        ))}
                                    </>
                                ) : (
                                    <>
                                        <Card key={kpiDataFirstLine[0].title} className='flex flex-col justify-center'>
                                            <Flex alignItems={'start'} justifyContent={'start'}>
                                                <div className={`truncate space-y-2`}>
                                                    <Text>{kpiDataFirstLine[0].title}</Text>
                                                    <Metric className='truncate text-5xl'>{kpiDataFirstLine[0].metric}</Metric>
                                                </div>
                                            </Flex>

                                            <>
                                                <Flex className='mt-4 space-x-2'>
                                                    <Text className='truncate'>{`${kpiDataFirstLine[0].progress}%`}</Text>
                                                    <Text className='truncate'>{kpiDataFirstLine[0].target}</Text>
                                                </Flex>
                                                <ProgressBar
                                                    value={kpiDataFirstLine[0].progress}
                                                    className='mt-2'
                                                    color={'#0d577c' as Color}
                                                />
                                            </>
                                        </Card>
                                        <Card key={kpiDataSecondLine[2].title} className='flex flex-col justify-center'>
                                            <Flex alignItems={'center'} justifyContent={'center'}>
                                                <div className={`truncate space-y-2 text-center`}>
                                                    <Text>{kpiDataSecondLine[2].title}</Text>
                                                    <Metric className='truncate text-5xl'>{kpiDataSecondLine[2].metric}</Metric>
                                                </div>
                                            </Flex>
                                        </Card>
                                    </>
                                )}
                            </Grid>
                            <Grid numItemsMd={2} numItemsLg={type === 'per' ? 3 : 2} className='mt-6 gap-6'>
                                {type === 'per' ? (
                                    <>
                                        {kpiDataSecondLine.map((item) => (
                                            <Card key={item.title}>
                                                <Flex alignItems='start'>
                                                    <div className='truncate space-y-2'>
                                                        <Text>{item.title}</Text>
                                                        <Metric className='truncate text-4xl'>{item.metric}</Metric>
                                                    </div>
                                                </Flex>
                                            </Card>
                                        ))}
                                    </>
                                ) : (
                                    <>
                                        {kpiDataSecondLine
                                            .filter((value, index) => index < 2)
                                            .map((item) => (
                                                <Card key={item.title}>
                                                    <Flex alignItems='start'>
                                                        <div className='truncate space-y-2'>
                                                            <Text>{item.title}</Text>
                                                            <Metric className='truncate text-4xl'>{item.metric}</Metric>
                                                        </div>
                                                    </Flex>
                                                </Card>
                                            ))}
                                    </>
                                )}
                            </Grid>
                            <div className='mt-6'>
                                <Card>
                                    <>
                                        <div className='md:flex justify-between'>
                                            <div>
                                                <Flex className='space-x-0.5' justifyContent='start' alignItems='center'>
                                                    <Title> Performance </Title>
                                                    <Icon
                                                        icon={InformationCircleIcon}
                                                        variant='simple'
                                                        tooltip='Performances non garanties'
                                                    />
                                                </Flex>
                                            </div>
                                        </div>
                                        {/* web */}
                                        <div className='mt-8 hidden sm:block'>
                                            <BarChart {...areaChartArgs} showLegend={true} stack={true} />
                                        </div>
                                        {/* mobile */}
                                        <div className='mt-8 sm:hidden'>
                                            <AreaChart {...areaChartArgs} startEndOnly={true} showGradient={false} showYAxis={false} />
                                        </div>
                                    </>
                                </Card>

                                {type === 'per' && (
                                    <div className='mt-6'>
                                        <h1 className='text-xl font-bold'>Impact fiscal</h1>
                                        <Grid numItemsMd={2} numItemsLg={2} className='mt-6 gap-6'>
                                            {kpiDataThirdLine.map((item) => (
                                                <Card key={item.title}>
                                                    <Flex alignItems='start'>
                                                        <div className='truncate space-y-2'>
                                                            <Text>{item.title}</Text>
                                                            <Metric className='truncate'>{item.metric}</Metric>
                                                        </div>
                                                    </Flex>
                                                </Card>
                                            ))}
                                        </Grid>
                                    </div>
                                )}
                            </div>
                        </TabPanel>
                    ) : (
                        <TabPanel>
                            <Grid numItemsMd={2} numItemsLg={2} className='mt-6 gap-6'>
                                {kpiSCPIFirstLine.map((item, index) => (
                                    <Card key={item.title} className='flex flex-col justify-center'>
                                        <Flex
                                            alignItems={index === 0 ? 'start' : 'center'}
                                            justifyContent={index === 0 ? 'start' : 'center'}
                                        >
                                            <div className={`truncate space-y-2 ${index === 1 && 'text-center'}`}>
                                                <Text>{item.title}</Text>
                                                <Metric className='truncate text-5xl'>{item.metric}</Metric>
                                            </div>
                                        </Flex>
                                    </Card>
                                ))}
                            </Grid>
                            <Grid numItemsMd={1} numItemsLg={1} className='mt-6 gap-6'>
                                {kpiSCPISecondLine.map((item, index) => (
                                    <Card key={item.title} className='flex flex-col justify-center'>
                                        <Flex
                                            alignItems={index === 0 ? 'start' : 'center'}
                                            justifyContent={index === 0 ? 'start' : 'center'}
                                        >
                                            <div className={`truncate space-y-2 ${index === 1 && 'text-center'}`}>
                                                <Text>{item.title}</Text>
                                                <Metric className='truncate text-5xl'>{item.metric}</Metric>
                                            </div>
                                        </Flex>
                                    </Card>
                                ))}
                            </Grid>
                            <div className='mt-6'>
                                <Card>
                                    <>
                                        <div className='md:flex justify-between'>
                                            <div>
                                                <Flex className='space-x-0.5' justifyContent='start' alignItems='center'>
                                                    <Title> Performance </Title>
                                                    <Icon
                                                        icon={InformationCircleIcon}
                                                        variant='simple'
                                                        tooltip='Performances non garanties'
                                                    />
                                                </Flex>
                                            </div>
                                        </div>
                                        {/* web */}
                                        <div className='mt-8 hidden sm:block'>
                                            <BarChart {...scpiAreaChartArgs} showLegend={true} stack={true} />
                                        </div>
                                        {/* mobile */}
                                        <div className='mt-8 sm:hidden'>
                                            <AreaChart {...scpiAreaChartArgs} startEndOnly={true} showGradient={false} showYAxis={false} />
                                        </div>
                                    </>
                                </Card>
                            </div>
                        </TabPanel>
                    )}
                </TabPanels>
            </TabGroup>
        </main>
    );
}
