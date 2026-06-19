'use client';

import { useTransition } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Lock, ArrowRight, Loader2 } from 'lucide-react';

import {
  applicationSchema,
  ApplicationSchemaType,
  applicantLevels,
  genders,
  relationships,
} from '@/lib/schemas/applicationSchema';

import {
  Field,
  FieldLabel,
  FieldDescription,
  FieldError,
  FieldGroup,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';

import SectionHeading from '@/components/SectionHeading';
import { useConfetti } from '@/hooks/use-confetti';

export default function ApplySection() {
  const [isPending, startTransition] = useTransition();

  const { triggerConfetti } = useConfetti();

  const form = useForm<ApplicationSchemaType>({
    resolver: zodResolver(applicationSchema),
    defaultValues: {
      studentFirstName: '',
      studentLastName: '',
      dateOfBirth: '',
      gender: 'Male',
      applyingForLevel: 'Kindergarten',
      currentSchool: '',
      parentFullName: '',
      relationshipToStudent: 'Father',
      parentEmail: '',
      parentPhone: '',
      homeAddress: '',
      howDidYouHear: '',
      additionalMessage: '',
    },
  });

  function onSubmit(values: ApplicationSchemaType) {
    startTransition(async () => {
      await new Promise((resolve) => setTimeout(resolve, 600));
      console.log(values);
      toast.success('Application submitted! We will be in touch shortly.');
      triggerConfetti();
      form.reset();
    });
  }

  return (
    <section className="section-pad bg-(--warm-white)">
      <div className="max-w-7xl mx-auto">
        <div className="mb-14 text-center sm:text-left">
          <SectionHeading
            eyebrow="Application Form"
            heading="Tell Us About Your Child"
            align="center"
          />
          <p className="font-body text-(--charcoal-100) text-base text-center leading-relaxed opacity-75">
            All fields marked are required. You can also pay the non-refundable
            application processing fee online once payments are enabled.
          </p>
        </div>

        <form
          className="flex flex-col gap-16"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          {/* ── Student details ── */}
          <div className="flex flex-col sm:flex-row gap-6 sm:gap-10">
            <div className="flex sm:flex-col items-center sm:items-start gap-3 sm:gap-2 shrink-0 sm:w-32">
              <span className="font-heading text-4xl text-terracotta leading-none">
                01
              </span>
              <div className="flex flex-col">
                <h3 className="font-heading text-lg text-(--charcoal) leading-tight">
                  Student Details
                </h3>
                <p className="font-body text-xs text-(--charcoal-100) opacity-60 hidden sm:block">
                  The child applying for admission
                </p>
              </div>
            </div>

            <div className="flex-1 border-t sm:border-t-0 sm:border-l border-(--border-sand) pt-8 sm:pt-0 sm:pl-10">
              <FieldGroup>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <Controller
                    name="studentFirstName"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel
                          htmlFor={field.name}
                          className="font-body text-sm font-medium text-(--charcoal)"
                        >
                          First Name
                        </FieldLabel>
                        <Input
                          {...field}
                          id={field.name}
                          placeholder="e.g. Ada"
                          aria-invalid={fieldState.invalid}
                          className="font-body border-(--border-sand) focus-visible:ring-terracotta focus-visible:border-terracotta h-11"
                        />
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />
                  <Controller
                    name="studentLastName"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel
                          htmlFor={field.name}
                          className="font-body text-sm font-medium text-(--charcoal)"
                        >
                          Last Name
                        </FieldLabel>
                        <Input
                          {...field}
                          id={field.name}
                          placeholder="e.g. Okonkwo"
                          aria-invalid={fieldState.invalid}
                          className="font-body border-(--border-sand) focus-visible:ring-terracotta focus-visible:border-terracotta h-11"
                        />
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <Controller
                    name="dateOfBirth"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel
                          htmlFor={field.name}
                          className="font-body text-sm font-medium text-(--charcoal)"
                        >
                          Date of Birth
                        </FieldLabel>
                        <Input
                          {...field}
                          id={field.name}
                          type="date"
                          aria-invalid={fieldState.invalid}
                          className="font-body border-(--border-sand) focus-visible:ring-terracotta focus-visible:border-terracotta h-11"
                        />
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />
                  <Controller
                    name="gender"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel
                          htmlFor={field.name}
                          className="font-body text-sm font-medium text-(--charcoal)"
                        >
                          Gender
                        </FieldLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <SelectTrigger
                            id={field.name}
                            className="w-full font-body border-(--border-sand) focus-visible:ring-terracotta h-11"
                            aria-invalid={fieldState.invalid}
                          >
                            <SelectValue placeholder="Select gender" />
                          </SelectTrigger>
                          <SelectContent>
                            {genders.map((g) => (
                              <SelectItem
                                key={g}
                                value={g}
                                className="font-body"
                              >
                                {g}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <Controller
                    name="applyingForLevel"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel
                          htmlFor={field.name}
                          className="font-body text-sm font-medium text-(--charcoal)"
                        >
                          Applying For
                        </FieldLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <SelectTrigger
                            id={field.name}
                            className="w-full font-body border-(--border-sand) focus-visible:ring-terracotta h-11"
                            aria-invalid={fieldState.invalid}
                          >
                            <SelectValue placeholder="Select level" />
                          </SelectTrigger>
                          <SelectContent>
                            {applicantLevels.map((level) => (
                              <SelectItem
                                key={level}
                                value={level}
                                className="font-body"
                              >
                                {level}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />
                  <Controller
                    name="currentSchool"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel
                          htmlFor={field.name}
                          className="font-body text-sm font-medium text-(--charcoal)"
                        >
                          Current School (if any)
                        </FieldLabel>
                        <Input
                          {...field}
                          id={field.name}
                          placeholder="e.g. Sunshine Nursery"
                          aria-invalid={fieldState.invalid}
                          className="font-body border-(--border-sand) focus-visible:ring-terracotta focus-visible:border-terracotta h-11"
                        />
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />
                </div>
              </FieldGroup>
            </div>
          </div>

          {/* ── Parent / guardian details ── */}
          <div className="flex flex-col sm:flex-row gap-6 sm:gap-10">
            <div className="flex sm:flex-col items-center sm:items-start gap-3 sm:gap-2 shrink-0 sm:w-32">
              <span className="font-heading text-4xl text-terracotta leading-none">
                02
              </span>
              <div className="flex flex-col">
                <h3 className="font-heading text-lg text-(--charcoal) leading-tight">
                  Parent / Guardian
                </h3>
                <p className="font-body text-xs text-(--charcoal-100) opacity-60 hidden sm:block">
                  Primary contact for this application
                </p>
              </div>
            </div>

            <div className="flex-1 border-t sm:border-t-0 sm:border-l border-(--border-sand) pt-8 sm:pt-0 sm:pl-10">
              <FieldGroup>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <Controller
                    name="parentFullName"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel
                          htmlFor={field.name}
                          className="font-body text-sm font-medium text-(--charcoal)"
                        >
                          Full Name
                        </FieldLabel>
                        <Input
                          {...field}
                          id={field.name}
                          placeholder="e.g. Mrs. Funke Okonkwo"
                          aria-invalid={fieldState.invalid}
                          className="font-body border-(--border-sand) focus-visible:ring-terracotta focus-visible:border-terracotta h-11"
                        />
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />
                  <Controller
                    name="relationshipToStudent"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel
                          htmlFor={field.name}
                          className="font-body text-sm font-medium text-(--charcoal)"
                        >
                          Relationship to Student
                        </FieldLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <SelectTrigger
                            id={field.name}
                            className="w-full font-body border-(--border-sand) focus-visible:ring-terracotta h-11"
                            aria-invalid={fieldState.invalid}
                          >
                            <SelectValue placeholder="Select relationship" />
                          </SelectTrigger>
                          <SelectContent>
                            {relationships.map((r) => (
                              <SelectItem
                                key={r}
                                value={r}
                                className="font-body"
                              >
                                {r}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <Controller
                    name="parentEmail"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel
                          htmlFor={field.name}
                          className="font-body text-sm font-medium text-(--charcoal)"
                        >
                          Email Address
                        </FieldLabel>
                        <Input
                          {...field}
                          id={field.name}
                          type="email"
                          placeholder="you@example.com"
                          aria-invalid={fieldState.invalid}
                          className="font-body border-(--border-sand) focus-visible:ring-terracotta focus-visible:border-terracotta h-11"
                        />
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />
                  <Controller
                    name="parentPhone"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel
                          htmlFor={field.name}
                          className="font-body text-sm font-medium text-(--charcoal)"
                        >
                          Phone Number
                        </FieldLabel>
                        <Input
                          {...field}
                          id={field.name}
                          type="tel"
                          placeholder="+234 801 234 5678"
                          aria-invalid={fieldState.invalid}
                          className="font-body border-(--border-sand) focus-visible:ring-terracotta focus-visible:border-terracotta h-11"
                        />
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />
                </div>

                <Controller
                  name="homeAddress"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel
                        htmlFor={field.name}
                        className="font-body text-sm font-medium text-(--charcoal)"
                      >
                        Home Address
                      </FieldLabel>
                      <Textarea
                        {...field}
                        id={field.name}
                        placeholder="Street, area, city, state"
                        className="font-body min-h-24 border-(--border-sand) focus-visible:ring-terracotta focus-visible:border-terracotta"
                        aria-invalid={fieldState.invalid}
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
              </FieldGroup>
            </div>
          </div>

          {/* ── Additional info ── */}
          <div className="flex flex-col sm:flex-row gap-6 sm:gap-10">
            <div className="flex sm:flex-col items-center sm:items-start gap-3 sm:gap-2 shrink-0 sm:w-32">
              <span className="font-heading text-4xl text-terracotta leading-none">
                03
              </span>
              <div className="flex flex-col">
                <h3 className="font-heading text-lg text-(--charcoal) leading-tight">
                  Additional Info
                </h3>
                <p className="font-body text-xs text-(--charcoal-100) opacity-60 hidden sm:block">
                  Optional, but helps us serve you better
                </p>
              </div>
            </div>

            <div className="flex-1 border-t sm:border-t-0 sm:border-l border-(--border-sand) pt-8 sm:pt-0 sm:pl-10">
              <FieldGroup>
                <Controller
                  name="howDidYouHear"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel
                        htmlFor={field.name}
                        className="font-body text-sm font-medium text-(--charcoal)"
                      >
                        How did you hear about Crestview?
                      </FieldLabel>
                      <Input
                        {...field}
                        id={field.name}
                        placeholder="e.g. Friend referral, social media, signage"
                        aria-invalid={fieldState.invalid}
                        className="font-body border-(--border-sand) focus-visible:ring-terracotta focus-visible:border-terracotta h-11"
                      />
                      <FieldDescription className="font-body text-xs opacity-60">
                        Optional
                      </FieldDescription>
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />

                <Controller
                  name="additionalMessage"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel
                        htmlFor={field.name}
                        className="font-body text-sm font-medium text-(--charcoal)"
                      >
                        Anything else you would like us to know?
                      </FieldLabel>
                      <Textarea
                        {...field}
                        id={field.name}
                        placeholder="Optional message"
                        className="font-body min-h-24 border-(--border-sand) focus-visible:ring-terracotta focus-visible:border-terracotta"
                        aria-invalid={fieldState.invalid}
                      />
                      <FieldDescription className="font-body text-xs opacity-60">
                        Optional
                      </FieldDescription>
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
              </FieldGroup>
            </div>
          </div>

          {/* ── Submit ── */}
          <div className="border-t border-(--border-sand) pt-10 flex flex-col items-center gap-5">
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                type="submit"
                disabled={isPending}
                className="group w-full sm:w-auto sm:px-12 bg-terracotta hover:bg-(--terracotta-mid) text-white font-body font-semibold tracking-wide py-6 text-base"
              >
                {isPending ? (
                  <>
                    Submitting...
                    <Loader2 className="animate-spin ml-1" />
                  </>
                ) : (
                  'Submit Application'
                )}
                {!isPending && (
                  <ArrowRight className="size-4 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
                )}
              </Button>

              <Button
                type="button"
                disabled
                variant="outline"
                className="flex-1 border-(--border-sand) text-(--charcoal-100) font-body font-medium tracking-wide py-6 text-base cursor-not-allowed opacity-60"
              >
                <Lock className="size-4 mr-2" />
                Pay Processing Fee Online
              </Button>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
}
