"use client";

import { createBudynek } from "@/actions/budynki";
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
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import * as z from "zod";

const formSchema = z.object({
  nazwa: z.string().min(1, "Nazwa jest wymagana"),
});

export function BudynekForm() {
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nazwa: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const formData = new FormData();
    formData.append("nazwa", values.nazwa);
    await createBudynek(formData);
    form.reset();
    router.refresh();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="nazwa"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nazwa budynku</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Wprowadź nazwę budynku" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Dodaj budynek</Button>
      </form>
    </Form>
  );
}
