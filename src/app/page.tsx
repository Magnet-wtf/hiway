import { Simulator } from '@/components/simulator';

export default function Home() {
    return (
        <main className='flex flex-col items-center justify-center p-24'>
            <div className='w-full flex justify-center items-center'>
                <Simulator />
            </div>
        </main>
    );
}
