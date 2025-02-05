"use client";

import { yupResolver } from "@hookform/resolvers/yup";
import { useFieldArray, useForm } from "react-hook-form";
import * as yup from "yup";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";

const formSchema = yup.object({
  items: yup.array().of(
    yup.object({
      field1: yup.string().required("Text field is required"),
      field2: yup
        .number()
        .typeError("Must be a number")
        .required("Number field is required")
        .min(0, "Must be positive"),
      field3: yup
        .string()
        .email("Must be a valid email")
        .required("Email field is required"),
      field4: yup
        .date()
        .typeError("Must be a valid date")
        .required("Date field is required"),
      field5: yup
        .string()
        .url("Must be a valid URL")
        .required("URL field is required"),
    })
  ),
});

type FormValues = yup.InferType<typeof formSchema>;

export default function Home() {
  const [renderTime, setRenderTime] = useState(0);
  const [operationTime, setOperationTime] = useState(0);
  const startTime = Date.now();

  useEffect(() => {
    const endTime = Date.now();
    setRenderTime(endTime - startTime);
  }, []);

  const form = useForm<FormValues>({
    resolver: yupResolver(formSchema),
    defaultValues: {
      items: [
        {
          field1: "",
          field2: 0,
          field3: "",
          field4: new Date(),
          field5: "",
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items",
  });

  const handleAppend = () => {
    const start = performance.now();
    append({
      field1: "",
      field2: 0,
      field3: "",
      field4: new Date(),
      field5: "",
    });
    const end = performance.now();
    setOperationTime(end - start);
  };

  const handleRemove = () => {
    if (fields.length > 1) {
      const start = performance.now();
      remove(fields.length - 1);
      const end = performance.now();
      setOperationTime(end - start);
    }
  };

  const onSubmit = (data: FormValues) => {
    toast.success("Form submitted successfully!", {
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    });
  };

  return (
    <div className="container mx-auto py-10">
      <Card className="p-6">
        <div className="mb-6 space-y-2">
          <h1 className="text-2xl font-bold">Form Array Performance Test</h1>
          <p className="text-muted-foreground">
            Initial render time: {renderTime}ms
          </p>
          <p className="text-muted-foreground">
            Last operation time: {operationTime}ms
          </p>
          <p className="text-muted-foreground">
            Number of items: {fields.length}
          </p>
        </div>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {fields.map((field, index) => (
            <div key={field.id} className="space-y-4 p-4 border rounded-lg">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Text</label>
                  <Input
                    {...form.register(`items.${index}.field1`)}
                    placeholder="Enter text"
                  />
                  {form.formState.errors.items?.[index]?.field1 && (
                    <p className="text-sm text-red-500">
                      {form.formState.errors.items[index]?.field1?.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Number</label>
                  <Input
                    type="number"
                    {...form.register(`items.${index}.field2`)}
                    placeholder="Enter number"
                  />
                  {form.formState.errors.items?.[index]?.field2 && (
                    <p className="text-sm text-red-500">
                      {form.formState.errors.items[index]?.field2?.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Email</label>
                  <Input
                    type="email"
                    {...form.register(`items.${index}.field3`)}
                    placeholder="Enter email"
                  />
                  {form.formState.errors.items?.[index]?.field3 && (
                    <p className="text-sm text-red-500">
                      {form.formState.errors.items[index]?.field3?.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Date</label>
                  <Input
                    type="date"
                    {...form.register(`items.${index}.field4`)}
                  />
                  {form.formState.errors.items?.[index]?.field4 && (
                    <p className="text-sm text-red-500">
                      {form.formState.errors.items[index]?.field4?.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">URL</label>
                  <Input
                    type="url"
                    {...form.register(`items.${index}.field5`)}
                    placeholder="Enter URL"
                  />
                  {form.formState.errors.items?.[index]?.field5 && (
                    <p className="text-sm text-red-500">
                      {form.formState.errors.items[index]?.field5?.message}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}

          <div className="flex gap-4">
            <Button
              type="button"
              onClick={handleAppend}
              className="bg-primary hover:bg-primary/90"
            >
              Add Item
            </Button>
            <Button
              type="button"
              onClick={handleRemove}
              variant="destructive"
              disabled={fields.length <= 1}
            >
              Remove Last
            </Button>
            <Button type="submit" variant="outline">
              Submit
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
