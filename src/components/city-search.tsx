import { useFavorite } from '@/hooks/use-favorite';
import { useSearchHistory } from '@/hooks/use-search-history';
import { useLocationSearch } from '@/hooks/use-weather';
import { Clock, Loader2, Search, Star, XCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from './ui/command';

export default function CitySearch() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');

  const { favorites } = useFavorite();
  const { data: locations, isLoading } = useLocationSearch(query);
  const { history, clearHistory, addToHistory } = useSearchHistory();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  const handleSelect = (cityData: string) => {
    const [lat, lon, name, country] = cityData.split('|');

    addToHistory.mutate({
      query,
      name,
      lat: parseFloat(lat),
      lon: parseFloat(lon),
      country,
    });

    navigate(`/city/${name}?lat=${lat}&lon=${lon}`);
    setOpen(false);
  };

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        variant='outline'
        className='relative w-full justify-start text-sm text-muted-foreground sm:pr-12 md:w-40 lg:w-64'
      >
        Search cities...
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput
          placeholder='Search cities...'
          value={query}
          onValueChange={setQuery}
        />
        <CommandList>
          {query.length > 2 && !isLoading && (
            <CommandEmpty>No Cities found.</CommandEmpty>
          )}
          {favorites.length > 0 && (
            <CommandGroup heading='Favorites'>
              {favorites.map((el) => (
                <CommandItem
                  key={el.id}
                  value={`${el.lat}|${el.lon}|${el.name}|${el.country}`}
                  onSelect={handleSelect}
                >
                  <Star className='mr-2 h-4 w-4 text-yellow-500' />
                  <span>{el.name}</span>
                  {el.state && (
                    <span className='text-sm text-muted-foreground'>
                      , {el.state}
                    </span>
                  )}
                  <span className='text-sm text-muted-foreground'>
                    , {el.country}
                  </span>
                </CommandItem>
              ))}
            </CommandGroup>
          )}
          {history.length > 0 && (
            <>
              <CommandSeparator />
              <CommandGroup>
                <div className='flex items-center justify-between px-2 my-2'>
                  <p className='text-sm text-muted-foreground'>
                    Recent Searches
                  </p>
                  <Button
                    variant='ghost'
                    size='sm'
                    onClick={() => clearHistory.mutate()}
                  >
                    <XCircle />
                    Clear
                  </Button>
                </div>
                {history.map((el) => (
                  <CommandItem
                    key={`${el.lat}-${el.lon}`}
                    value={`${el.lat}|${el.lon}|${el.name}|${el.country}`}
                    onSelect={handleSelect}
                  >
                    <Clock className='mr-2 h-4 w-4' />
                    <span>{el.name}</span>
                    {el.state && (
                      <span className='text-sm text-muted-foreground'>
                        , {el.state}
                      </span>
                    )}
                    <span className='text-sm text-muted-foreground'>
                      , {el.country}
                    </span>
                    <span className='ml-auto text-xs text-muted-foreground'>
                      {new Date(el.searchedAt).toLocaleString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        hour: 'numeric',
                        minute: 'numeric',
                        hour12: true,
                      })}
                    </span>
                  </CommandItem>
                ))}
              </CommandGroup>
            </>
          )}
          <CommandSeparator />
          {locations && locations.length > 0 && (
            <CommandGroup heading='Suggestions'>
              {isLoading && (
                <div className='flex items-center justify-center p-4'>
                  <Loader2 className='h-4 w-4 animate-spin' />
                </div>
              )}
              {locations.map((el) => (
                <CommandItem
                  key={`${el.lat}-${el.lon}`}
                  value={`${el.lat}|${el.lon}|${el.name}|${el.country}`}
                  onSelect={handleSelect}
                >
                  <Search className='mr-2 h-4 w-4' />
                  <span>{el.name}</span>
                  {el.state && (
                    <span className='text-sm text-muted-foreground'>
                      , {el.state}
                    </span>
                  )}
                  <span className='text-sm text-muted-foreground'>
                    , {el.country}
                  </span>
                </CommandItem>
              ))}
            </CommandGroup>
          )}
        </CommandList>
      </CommandDialog>
    </>
  );
}
