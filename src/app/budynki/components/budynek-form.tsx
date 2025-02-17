"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { createBudynek } from "@/actions/budynki";

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
