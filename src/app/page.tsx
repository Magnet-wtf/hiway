import { Simulator } from '@/components/simulator';

export default function Home() {
    return (
        <main className='flex flex-col items-center justify-center px-24 py-8'>
            <div className='w-full flex justify-center items-center'>
                <Simulator />
            </div>
        </main>
    );
}
