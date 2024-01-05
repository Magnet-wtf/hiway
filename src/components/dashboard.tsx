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
}) {
    const [selectedIndex, setSelectedIndex] = useState(0);
    const selectedKpi = kpiList[selectedIndex];
    const [selectedStatus, setSelectedStatus] = useState('all');
    const [selectedNames, setSelectedNames] = useState<string[]>([]);

    const isSalesPersonSelected = (salesPerson: SalesPerson) =>
        (salesPerson.status === selectedStatus || selectedStatus === 'all') &&
        (selectedNames.includes(salesPerson.name) || selectedNames.length === 0);

    const kpiDataFirstLine: Kpi[] = [
        {
            title: 'CAPITAL ESPÉRÉ À 67 ANS',
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

    const areaChartArgs = {
        className: 'mt-5 h-96',
        data: buildPerformanceFromTotalInvestmentAndComposedInterestYearOverYear(),
        index: 'date',
        categories: ['Versements cumulés', 'Intérêt cumulés'],
        colors: ['blue', 'yellow'] as Color[],
        showLegend: false,
        valueFormatter: (number: number) => `${usNumberformatter(number)}`,
        yAxisWidth: 120,
    };
    return (
        <main>
            <TabGroup className='mt-6'>
                <TabPanels>
                    <TabPanel>
                        <Grid numItemsMd={2} numItemsLg={2} className='mt-6 gap-6'>
                            {kpiDataFirstLine.map((item, index) => (
                                <Card key={item.title} className='flex flex-col justify-center'>
                                    <Flex alignItems={index === 0 ? 'start' : 'center'} justifyContent={index === 0 ? 'start' : 'center'}>
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
                                            <ProgressBar value={item.progress} className='mt-2' />
                                        </>
                                    )}
                                </Card>
                            ))}
                        </Grid>
                        <Grid numItemsMd={2} numItemsLg={3} className='mt-6 gap-6'>
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
                                                    tooltip='Shows daily increase or decrease of particular domain'
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

                            <div className='mt-6'>
                                <h1 className='text-xl font-bold'>Impact fiscale</h1>
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
                        </div>
                    </TabPanel>
                    <TabPanel>
                        <div className='mt-6'>
                            <Card>
                                <>
                                    <div>
                                        <Flex className='space-x-0.5' justifyContent='start' alignItems='center'>
                                            <Title> Performance History </Title>
                                            <Icon
                                                icon={InformationCircleIcon}
                                                variant='simple'
                                                tooltip='Shows sales performance per employee'
                                            />
                                        </Flex>
                                    </div>
                                    <div className='flex space-x-2'>
                                        <MultiSelect
                                            className='max-w-full sm:max-w-xs'
                                            onValueChange={setSelectedNames}
                                            placeholder='Select Salespeople...'
                                        >
                                            {salesPeople.map((item) => (
                                                <MultiSelectItem key={item.name} value={item.name}>
                                                    {item.name}
                                                </MultiSelectItem>
                                            ))}
                                        </MultiSelect>
                                        <Select className='max-w-full sm:max-w-xs' defaultValue='all' onValueChange={setSelectedStatus}>
                                            <SelectItem value='all'>All Performances</SelectItem>
                                            <SelectItem value='overperforming'>Overperforming</SelectItem>
                                            <SelectItem value='average'>Average</SelectItem>
                                            <SelectItem value='underperforming'>Underperforming</SelectItem>
                                        </Select>
                                    </div>
                                    <Table className='mt-6'>
                                        <TableHead>
                                            <TableRow>
                                                <TableHeaderCell>Name</TableHeaderCell>
                                                <TableHeaderCell className='text-right'>Leads</TableHeaderCell>
                                                <TableHeaderCell className='text-right'>Sales ($)</TableHeaderCell>
                                                <TableHeaderCell className='text-right'>Quota ($)</TableHeaderCell>
                                                <TableHeaderCell className='text-right'>Variance</TableHeaderCell>
                                                <TableHeaderCell className='text-right'>Region</TableHeaderCell>
                                                <TableHeaderCell className='text-right'>Status</TableHeaderCell>
                                            </TableRow>
                                        </TableHead>

                                        <TableBody>
                                            {salesPeople
                                                .filter((item) => isSalesPersonSelected(item))
                                                .map((item) => (
                                                    <TableRow key={item.name}>
                                                        <TableCell>{item.name}</TableCell>
                                                        <TableCell className='text-right'>{item.leads}</TableCell>
                                                        <TableCell className='text-right'>{item.sales}</TableCell>
                                                        <TableCell className='text-right'>{item.quota}</TableCell>
                                                        <TableCell className='text-right'>{item.variance}</TableCell>
                                                        <TableCell className='text-right'>{item.region}</TableCell>
                                                        <TableCell className='text-right'>
                                                            <BadgeDelta deltaType={deltaTypes[item.status]} size='xs'>
                                                                {item.status}
                                                            </BadgeDelta>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                        </TableBody>
                                    </Table>
                                </>
                            </Card>
                        </div>
                    </TabPanel>
                </TabPanels>
            </TabGroup>
        </main>
    );
}
