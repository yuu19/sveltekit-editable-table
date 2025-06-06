import type { Payment } from './columns';
export async function load() {
	// logic to fetch payments data here
	const data = [
		{
			id: '728ed52f',
			currentPomodoroCount: 0,
			targetPomodoroCount: 100,
			status: 'pending',
			task: '線形代数',
			email: 'm@example.com'
		},
		{
			id: '489e1d42',
			currentPomodoroCount: 10,
			targetPomodoroCount: 125,
			status: 'processing',
			task: '電磁気学',
			email: 'example@gmail.com'
		}
	] as Payment[];
	const payments = data;
	return {
		payments
	};
}
