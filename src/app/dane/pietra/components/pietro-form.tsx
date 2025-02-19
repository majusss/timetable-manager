"use client";

import { createPietro } from "@/actions/pietra";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import * as z from "zod";

const formSchema = z.object({
  numer: z.number().min(1, "Numer piętra jest wymagany"),
  budynekId: z.string().min(1, "Wybierz budynek"),
});

interface PietroFormProps {
  budynki: {
    id: string;
    nazwa: string;
  }[];
}

export function PietroForm({ budynki }: PietroFormProps) {
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      numer: 0,
      budynekId: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    await createPietro(values.numer, values.budynekId);
    form.reset();
    router.refresh();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="numer"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Numer piętra</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  {...field}
                  placeholder="Wprowadź numer piętra"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="budynekId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Budynek</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Wybierz budynek" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {budynki.map((budynek) => (
                    <SelectItem key={budynek.id} value={budynek.id}>
                      {budynek.nazwa}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Dodaj piętro</Button>
      </form>
    </Form>
  );
}
