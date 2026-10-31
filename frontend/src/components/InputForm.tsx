'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useSafeClerk } from '@/lib/auth-context';
import { Loader2, LocateIcon, ShieldAlert } from 'lucide-react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { Slider } from './ui/slider';
import { Textarea } from './ui/textarea';
import { Checkbox } from './ui/checkbox';

const contactMethods = ['Phone', 'Email', 'Text message', 'In-person'];

const FormSchema = z.object({
  name: z.string().min(2, {
    message: 'Username must be at least 2 characters.',
  }),
  phone: z.string().optional(),
  location: z.object({
    lat: z.number(),
    lng: z.number(),
  }),
  occurrenceDuration: z.union([z.string(), z.number()]).optional(),
  frequency: z.union([z.string(), z.number()]).optional(),
  visibleInjuries: z.enum(['Yes', 'No']),
  preferredContact: z
    .array(z.enum(['Phone', 'Email', 'Text message', 'In-person']))
    .min(1, {
      message: 'Please select at least one contact method.',
    }),
  currentSituation: z
    .string()
    .min(5, { message: 'Please describe the current situation.' }),
  culprit: z.string().min(5, { message: 'Please describe the culprit.' }),
});

// interface InputFormProps {
//   setResImage: (resImage: string) => void;
// }
// { setResImage }: InputFormProps
export function InputForm({
  setText,
  setTextGemma,
  setFormData,
}: {
  setText: (resText: string) => void;
  setTextGemma: (resText: string) => void;
  setFormData?: (data: any) => void;
}) {
  const { user } = useSafeClerk();
  const router = useRouter();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: user?.fullName || user?.name || '',
      phone: '',
      location: { lat: 28.6139, lng: 77.2090 }, // Default coordinates
      occurrenceDuration: '1',
      frequency: '1',
      visibleInjuries: 'No',
      preferredContact: ['Phone'],
      currentSituation: '',
      culprit: '',
    },
  });

  const [occurrenceDuration, setOccurrenceDuration] = useState(1);
  const [frequency, setFrequency] = useState(1);
  const [loading, setLoading] = useState(false);
  const [directSaving, setDirectSaving] = useState(false);
  const [selectedContactMethods, setSelectedContactMethods] = useState<
    string[]
  >(['Phone']);

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          // Set the location as an object with lat and lng
          form.setValue('location', { lat: latitude, lng: longitude });
        },
        (error) => {
          console.warn('Geolocation notice:', error);
        },
        { enableHighAccuracy: true }
      );
    } else {
      console.warn('Geolocation is not supported by this browser.');
    }
  };

  const saveIncidentRecord = async (data: z.infer<typeof FormSchema>) => {
    const victimName = data.name.trim();
    const locString = `${data.location?.lat || 28.6139}, ${data.location?.lng || 77.2090}`;

    const postData = {
      _id: 'post_' + Date.now(),
      Name: victimName,
      name: victimName,
      Location: locString,
      state: 'Emergency SOS Location',
      'Severity of domestic violence': data.visibleInjuries === 'Yes' ? 'Very High' : 'High',
      'Nature of domestic violence': data.currentSituation
        ? data.currentSituation.slice(0, 60)
        : 'Domestic Violence Incident',
      Contact: data.phone || '+91 Confidential',
      'Current Situation': data.currentSituation,
      'Culprit Description': data.culprit,
      status: 'pending',
    };

    try {
      await axios.post('/api/save', postData);
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('safespark_current_report', JSON.stringify({ ...data, _id: postData._id }));
        const existingLocal = JSON.parse(localStorage.getItem('safespark_local_posts') || '[]');
        localStorage.setItem(
          'safespark_local_posts',
          JSON.stringify([postData, ...existingLocal.filter((p: any) => p._id !== postData._id)])
        );
      }
    } catch (err) {
      console.warn('Save notice:', err);
    }

    return postData;
  };

  const onDirectSaveAndGoToDashboard = () => {
    form.handleSubmit(async (data) => {
      try {
        setDirectSaving(true);
        await saveIncidentRecord(data);
        setDirectSaving(false);
        router.push('/dashboard');
      } catch (err) {
        console.warn('Save notice:', err);
        setDirectSaving(false);
        router.push('/dashboard');
      }
    })();
  };

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
      setLoading(true);
      // Immediately save post so it's guaranteed to be on Dashboard
      const postData = await saveIncidentRecord(data);

      if (setFormData) {
        setFormData({ ...data, _id: postData._id });
      }

      const res = await axios.post('/api/generate-text', data);
      if (res.data?.gemini_response && res.data?.gemma_response) {
        setText(res.data.gemini_response);
        setTextGemma(res.data.gemma_response);
        setLoading(false);
      } else {
        setLoading(false);
      }
    } catch (e) {
      console.warn('AI analysis notice (saved data safely retained):', e);
      setLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="max-w-2xl mx-auto space-y-6 w-full"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Your name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="preferredContact"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Preferred Contact Method</FormLabel>
              <FormControl>
                <div className="space-y-2">
                  {contactMethods.map((method) => (
                    <div key={method} className="flex items-center gap-2">
                      <Checkbox
                        checked={field.value.includes(
                          method as
                            | 'Phone'
                            | 'Email'
                            | 'Text message'
                            | 'In-person'
                        )}
                        onCheckedChange={(checked) => {
                          const newValue = checked
                            ? [...field.value, method]
                            : field.value.filter((item) => item !== method);
                          field.onChange(newValue);
                          setSelectedContactMethods(newValue);
                        }}
                      />
                      <span>{method}</span>
                    </div>
                  ))}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {selectedContactMethods.includes('Phone') && (
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone</FormLabel>
                <FormControl>
                  <Input placeholder="Your phone number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Location</FormLabel>
              <FormControl>
                <Input
                  placeholder="Type or auto-detect your location"
                  value={`Lat: ${field.value.lat}, Lon: ${field.value.lng}`}
                  readOnly
                />
              </FormControl>
              <Button
                type="button"
                onClick={getUserLocation}
                className="mt-2 flex items-center gap-2"
                variant={'outline'}
              >
                <LocateIcon className="h-5 w-5" />
                Auto-detect Location
              </Button>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="occurrenceDuration"
          render={({ field }) => (
            <FormItem>
              <FormLabel>How long has it been occurring</FormLabel>
              <FormControl>
                <div className="flex items-center gap-2">
                  <Slider
                    {...field}
                    value={[occurrenceDuration]}
                    min={1}
                    max={100}
                    className="flex-1"
                    onValueChange={(value) => {
                      setOccurrenceDuration(value[0]);
                      field.onChange(value[0]);
                    }}
                  />
                  <span>{occurrenceDuration} months</span>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="frequency"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Frequency of Incidents</FormLabel>
              <FormControl>
                <div className="flex items-center gap-2">
                  <Slider
                    {...field}
                    value={[frequency]}
                    min={1}
                    max={100}
                    className="flex-1"
                    onValueChange={(value) => {
                      setFrequency(value[0]);
                      field.onChange(value[0]);
                    }}
                  />
                  <span>{frequency} times</span>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="currentSituation"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Describe the Current Situation</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Keywords describing the situation (e.g., emotional abuse, hurts child)"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="culprit"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Describe the Culprit</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Keywords describing the culprit (e.g., dark skin, tall, blue eyes)"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
          <Button
            type="button"
            onClick={onDirectSaveAndGoToDashboard}
            disabled={directSaving || loading}
            className="w-full sm:flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-6 text-sm shadow-md flex items-center justify-center gap-2 rounded-xl transition-all"
          >
            {directSaving ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Saving to Dashboard...
              </>
            ) : (
              <>
                <ShieldAlert className="h-5 w-5" />
                Submit & View on Dashboard
              </>
            )}
          </Button>

          <Button
            type="submit"
            disabled={loading || directSaving}
            variant="outline"
            className="w-full sm:flex-1 border-slate-300 dark:border-slate-700 py-6 text-sm font-medium flex items-center justify-center gap-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            {loading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Processing AI Report...
              </>
            ) : (
              <>
                AI Steganography Mode →
              </>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
