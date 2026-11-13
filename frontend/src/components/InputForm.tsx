'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useState, useCallback } from 'react';
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
import {
  Loader2,
  LocateIcon,
  ShieldAlert,
  Mic,
  Sparkles,
  Volume2,
  CheckCircle2,
  HelpCircle,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { Slider } from './ui/slider';
import { Textarea } from './ui/textarea';
import { Checkbox } from './ui/checkbox';
import { VoiceDictationButton } from './VoiceDictationButton';
import VoiceInput from './VoiceInput';
import { useVoiceAgent } from '@/hooks/useVoiceAgent';
import { useTranslations, useLocale } from 'next-intl';

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
  const t = useTranslations('sos');
  const locale = useLocale();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: user?.fullName || user?.name || '',
      phone: '',
      location: { lat: 28.6139, lng: 77.2090 },
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
  const [selectedContactMethods, setSelectedContactMethods] = useState<string[]>(['Phone']);

  // Natural speech full-form filling state
  const [isFormFillingVoice, setIsFormFillingVoice] = useState(false);
  const [voiceExtracting, setVoiceExtracting] = useState(false);
  const [aiFilledFields, setAiFilledFields] = useState<Set<string>>(new Set());
  const [followUpQuestion, setFollowUpQuestion] = useState<string | null>(null);

  const { speak } = useVoiceAgent();

  const handleFullFormExtraction = async (fullTranscript: string) => {
    if (!fullTranscript || !fullTranscript.trim()) return;
    setVoiceExtracting(true);

    try {
      const res = await fetch('/api/voice/extract-form', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transcript: fullTranscript, language: locale }),
      });

      if (res.ok) {
        const data = await res.json();
        const filled = new Set<string>();

        if (data.name) {
          form.setValue('name', data.name);
          filled.add('name');
        }
        if (data.phone) {
          form.setValue('phone', data.phone);
          filled.add('phone');
        }
        if (data.current_situation) {
          form.setValue('currentSituation', data.current_situation);
          filled.add('currentSituation');
        }
        if (data.culprit_description) {
          form.setValue('culprit', data.culprit_description);
          filled.add('culprit');
        }
        if (data.visible_injuries) {
          form.setValue('visibleInjuries', data.visible_injuries === 'Yes' ? 'Yes' : 'No');
          filled.add('visibleInjuries');
        }

        setAiFilledFields(filled);

        if (data.follow_up_question) {
          setFollowUpQuestion(data.follow_up_question);
          speak(data.follow_up_question, locale);
        }
      }
    } catch (e) {
      console.warn('Form extraction notice:', e);
    } finally {
      setVoiceExtracting(false);
      setIsFormFillingVoice(false);
    }
  };

  const {
    isRecording: isFormVoiceRecording,
    toggleListening: toggleFormVoiceListening,
    transcript: formVoiceTranscript,
  } = useVoiceAgent({
    language: locale,
    onTranscript: (t, isFinal) => {
      if (isFinal) {
        handleFullFormExtraction(t);
      }
    },
  });

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
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
      language: locale,
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
      const postData = await saveIncidentRecord(data);

      if (setFormData) {
        setFormData({ ...data, _id: postData._id });
      }

      const res = await axios.post('/api/generate-text', { ...data, language: locale });
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
      <form onSubmit={form.handleSubmit(onSubmit)} className="max-w-2xl mx-auto space-y-6 w-full">
        {/* Speak to Fill the Entire Form AI Banner */}
        <div className="bg-gradient-to-r from-rose-50 via-purple-50 to-indigo-50 dark:from-slate-900 dark:via-purple-950/30 dark:to-slate-900 border border-rani/30 dark:border-rani/20 rounded-2xl p-4 sm:p-5 shadow-sm relative overflow-hidden">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rani to-saffron flex items-center justify-center text-white shrink-0 shadow-md">
                <Sparkles className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
                  <span>{t('speakToFill')}</span>
                  <span className="text-[10px] bg-rani/10 text-rani font-bold px-2 py-0.5 rounded-full uppercase">
                    AI Auto-Fill
                  </span>
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
                  {isFormVoiceRecording ? t('speakingNotice') : t('voiceWarning')}
                </p>
              </div>
            </div>

            <Button
              type="button"
              onClick={() => {
                setIsFormFillingVoice(true);
                toggleFormVoiceListening();
              }}
              disabled={voiceExtracting}
              className={`rounded-xl text-xs font-bold px-4 py-2.5 transition-all shadow-sm flex items-center gap-2 ${
                isFormVoiceRecording
                  ? 'bg-rose-600 hover:bg-rose-700 text-white animate-pulse'
                  : 'bg-white dark:bg-slate-800 text-rani border border-rani/40 hover:bg-rose-50'
              }`}
            >
              {voiceExtracting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Extracting...</span>
                </>
              ) : isFormVoiceRecording ? (
                <>
                  <Mic className="w-4 h-4 animate-bounce" />
                  <span>Stop & Extract</span>
                </>
              ) : (
                <>
                  <Mic className="w-4 h-4 text-rani" />
                  <span>Start Dictation</span>
                </>
              )}
            </Button>
          </div>

          {/* Spoken follow-up assistant banner */}
          {followUpQuestion && (
            <div className="mt-3 p-3 bg-white/90 dark:bg-slate-800/90 rounded-xl border border-rani/20 flex items-start gap-2 text-xs">
              <HelpCircle className="w-4 h-4 text-rani shrink-0 mt-0.5" />
              <div className="flex-1">
                <span className="font-semibold text-slate-900 dark:text-white">Follow-up Question: </span>
                <span className="text-slate-700 dark:text-slate-200">{followUpQuestion}</span>
              </div>
            </div>
          )}

          {aiFilledFields.size > 0 && (
            <div className="mt-2 text-[11px] text-burgundy-300 font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-burgundy-300" />
              <span>{t('aiFilledNotice')}</span>
            </div>
          )}
        </div>

        {/* Name Field with Dedicated Mic Button */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center justify-between">
                <FormLabel className="flex items-center gap-1.5 font-semibold text-sm">
                  <span>{t('nameLabel')}</span>
                  {aiFilledFields.has('name') && (
                    <span className="text-[10px] text-rani bg-rose-50 dark:bg-rose-950 px-1.5 py-0.5 rounded-md font-bold">
                      Voice Filled
                    </span>
                  )}
                </FormLabel>
                <VoiceInput
                  buttonSize="sm"
                  language={locale}
                  onTranscript={(txt) => field.onChange(txt)}
                />
              </div>
              <FormControl>
                <Input placeholder={t('namePlaceholder')} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Preferred Contact Method */}
        <FormField
          control={form.control}
          name="preferredContact"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-semibold text-sm">{t('contactMethodsLabel')}</FormLabel>
              <FormControl>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                  {contactMethods.map((method) => (
                    <div
                      key={method}
                      className="flex items-center gap-2 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-900/60"
                    >
                      <Checkbox
                        checked={field.value.includes(method as any)}
                        onCheckedChange={(checked) => {
                          const newValue = checked
                            ? [...field.value, method]
                            : field.value.filter((item) => item !== method);
                          field.onChange(newValue);
                          setSelectedContactMethods(newValue);
                        }}
                      />
                      <span className="text-xs font-medium text-slate-800 dark:text-slate-200">
                        {method}
                      </span>
                    </div>
                  ))}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Phone Field */}
        {selectedContactMethods.includes('Phone') && (
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center justify-between">
                  <FormLabel className="flex items-center gap-1.5 font-semibold text-sm">
                    <span>{t('phoneLabel')}</span>
                    {aiFilledFields.has('phone') && (
                      <span className="text-[10px] text-rani bg-rose-50 px-1.5 py-0.5 rounded-md font-bold">
                        Voice Filled
                      </span>
                    )}
                  </FormLabel>
                  <VoiceInput
                    buttonSize="sm"
                    language={locale}
                    onTranscript={(txt) => field.onChange(txt)}
                  />
                </div>
                <FormControl>
                  <Input placeholder={t('phonePlaceholder')} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {/* Location with GPS */}
        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-semibold text-sm">{t('locationLabel')}</FormLabel>
              <FormControl>
                <div className="flex items-center gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={getUserLocation}
                    className="flex items-center gap-2 text-xs font-semibold rounded-xl"
                  >
                    <LocateIcon className="w-4 h-4 text-rani" />
                    <span>{t('getLocation')}</span>
                  </Button>
                  <span className="text-xs text-slate-500 font-mono">
                    {field.value?.lat?.toFixed(4)}, {field.value?.lng?.toFixed(4)}
                  </span>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Current Situation Description with Dedicated Mic */}
        <FormField
          control={form.control}
          name="currentSituation"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center justify-between">
                <FormLabel className="flex items-center gap-1.5 font-semibold text-sm">
                  <span>{t('situationLabel')}</span>
                  {aiFilledFields.has('currentSituation') && (
                    <span className="text-[10px] text-rani bg-rose-50 dark:bg-rose-950 px-1.5 py-0.5 rounded-md font-bold">
                      Voice Filled
                    </span>
                  )}
                </FormLabel>
                <div className="flex items-center gap-1.5">
                  <VoiceDictationButton
                    buttonText="Gnani AI"
                    onTranscribed={(txt) => {
                      const current = field.value || '';
                      field.onChange(current ? `${current} ${txt}` : txt);
                    }}
                  />
                  <VoiceInput
                    buttonSize="sm"
                    language={locale}
                    onTranscript={(txt) => {
                      const current = field.value || '';
                      field.onChange(current ? `${current} ${txt}` : txt);
                    }}
                  />
                </div>
              </div>
              <FormControl>
                <Textarea
                  placeholder={t('situationPlaceholder')}
                  className="min-h-[100px] resize-y rounded-xl"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Culprit Description with Dedicated Mic */}
        <FormField
          control={form.control}
          name="culprit"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center justify-between">
                <FormLabel className="flex items-center gap-1.5 font-semibold text-sm">
                  <span>{t('culpritLabel')}</span>
                  {aiFilledFields.has('culprit') && (
                    <span className="text-[10px] text-rani bg-rose-50 dark:bg-rose-950 px-1.5 py-0.5 rounded-md font-bold">
                      Voice Filled
                    </span>
                  )}
                </FormLabel>
                <div className="flex items-center gap-1.5">
                  <VoiceDictationButton
                    buttonText="Gnani AI"
                    onTranscribed={(txt) => {
                      const current = field.value || '';
                      field.onChange(current ? `${current} ${txt}` : txt);
                    }}
                  />
                  <VoiceInput
                    buttonSize="sm"
                    language={locale}
                    onTranscript={(txt) => {
                      const current = field.value || '';
                      field.onChange(current ? `${current} ${txt}` : txt);
                    }}
                  />
                </div>
              </div>
              <FormControl>
                <Textarea
                  placeholder={t('culpritPlaceholder')}
                  className="min-h-[90px] resize-y rounded-xl"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Duration Slider */}
        <div className="space-y-2">
          <label className="text-sm font-semibold">{t('durationLabel')}</label>
          <Slider
            value={[occurrenceDuration]}
            onValueChange={(val) => {
              setOccurrenceDuration(val[0]);
              form.setValue('occurrenceDuration', val[0].toString());
            }}
            max={10}
            min={1}
            step={1}
          />
          <div className="text-xs text-slate-500">{occurrenceDuration} year(s)</div>
        </div>

        {/* Frequency Slider */}
        <div className="space-y-2">
          <label className="text-sm font-semibold">{t('frequencyLabel')}</label>
          <Slider
            value={[frequency]}
            onValueChange={(val) => {
              setFrequency(val[0]);
              form.setValue('frequency', val[0].toString());
            }}
            max={7}
            min={1}
            step={1}
          />
          <div className="text-xs text-slate-500">{frequency} time(s) a week</div>
        </div>

        {/* Direct Save & Steganography Actions */}
        <div className="flex flex-col sm:flex-row gap-3 pt-3">
          <Button
            type="button"
            onClick={onDirectSaveAndGoToDashboard}
            disabled={directSaving || loading}
            className="flex-1 bg-gradient-to-r from-rani to-purple-600 hover:from-rani-600 hover:to-purple-700 text-white font-bold py-3 rounded-xl shadow-md"
          >
            {directSaving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                <span>{t('submitting')}</span>
              </>
            ) : (
              <span>{t('directSave')}</span>
            )}
          </Button>

          <Button
            type="submit"
            disabled={loading || directSaving}
            variant="outline"
            className="flex-1 border-rani/40 hover:bg-rose-50 dark:hover:bg-rose-950 font-bold py-3 rounded-xl"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                <span>{t('submitting')}</span>
              </>
            ) : (
              <span>{t('stegoEncode')}</span>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}

