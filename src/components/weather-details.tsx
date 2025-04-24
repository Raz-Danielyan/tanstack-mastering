import { WeatherData } from '@/api/types';
import { Compass, Gauge, Sunrise, Sunset } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

type weatherDetailsProps = {
  data: WeatherData;
};

export default function WeatherDetails({ data }: weatherDetailsProps) {
  const { wind, main, sys } = data;

  const getWindDirection = (degree: number) => {
    const direction = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];

    const index =
      Math.round(((degree %= 360) < 0 ? degree + 360 : degree) / 45) % 8;

    return direction[index];
  };

  const details = [
    {
      title: 'Sunrise',
      value: new Date(sys.sunrise * 1000).toLocaleString('en-US', {
        hour: 'numeric',
        minute: 'numeric',
        hour12: true,
      }),
      icon: Sunrise,
      color: 'text-orange-500',
    },
    {
      title: 'Sunset',
      value: new Date(sys.sunset * 1000).toLocaleString('en-US', {
        hour: 'numeric',
        minute: 'numeric',
        hour12: true,
      }),
      icon: Sunset,
      color: 'text-blue-500',
    },
    {
      title: 'Wind direction',
      value: `${getWindDirection(wind.deg)} (${wind.deg}°)`,
      icon: Compass,
      color: 'text-green-500',
    },
    {
      title: 'Pressure',
      value: `${main.pressure} hPa`,
      icon: Gauge,
      color: 'text-purple-500',
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Weather Details</CardTitle>
      </CardHeader>
      <CardContent>
        <div className='grid gap-6 sm:grid-cols-2'>
          {details.map((detail) => (
            <div
              key={detail.title}
              className='flex items-center gap-3 rounded-lg border p-4'
            >
              <detail.icon className={`h-5 w-5 ${detail.color}`} />
              <div>
                <p className='text-sm font-medium leading-none'>
                  {detail.title}
                </p>
                <p className='text-sm text-muted-foreground'>{detail.value}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
