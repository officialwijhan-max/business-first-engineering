import { useState, type FormEvent, type ReactNode } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { PageIntro } from "@/components/page-elements";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { englishLocaleMeta, languageAlternates } from "@/lib/seo";

export const Route = createFileRoute("/contact")({
  head: () => ({ meta: [
    { title: "Start a Project | Contact Wijhan" },
    { name: "description", content: "Tell Wijhan what you are trying to build, improve or solve. Start a product engineering conversation." },
    { property: "og:title", content: "Start a Project | Contact Wijhan" },
    { property: "og:description", content: "Let’s understand the problem first." },
    { property: "og:type", content: "website" }, { property: "og:url", content: "/contact" }, { name: "twitter:card", content: "summary_large_image" },
      ...englishLocaleMeta,
  ], links: [{ rel: "canonical", href: "/contact" }, ...languageAlternates("/contact", "/ar/contact")] }), component: ContactPage,
});

function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  function submit(event: FormEvent<HTMLFormElement>) { event.preventDefault(); setSubmitted(true); }
  return <>
    <PageIntro eyebrow="Start a project" title={<>Let’s understand<br /><span className="text-primary-foreground/45">the problem first.</span></>} copy="Tell us what you’re trying to build, improve, or solve. A useful conversation starts with context, not a sales pitch." />
    <section className="section-pad"><div className="site-container grid gap-16 lg:grid-cols-[.65fr_1.35fr]">
      <aside className="reveal"><p className="eyebrow text-accent">Before you send</p><h2 className="mt-5 font-display text-4xl">A little context goes a long way.</h2><p className="mt-6 leading-7 text-muted-foreground">Share the business need, who it affects and what a better outcome would look like. You do not need a finished specification.</p><div className="mt-10 border-t border-border pt-6"><p className="text-xs uppercase text-muted-foreground">Website</p><a className="mt-2 block text-lg font-semibold" href="https://wijhan.com">wijhan.com</a><p className="mt-6 text-sm text-muted-foreground">Official email, phone and office details will be added when supplied.</p></div></aside>
      {submitted ? <div className="flex min-h-96 flex-col items-start justify-center border-y border-border py-12 reveal"><CheckCircle2 className="size-9 text-accent"/><h2 className="mt-7 font-display text-4xl">Your brief is ready.</h2><p className="mt-5 max-w-lg leading-7 text-muted-foreground">Form delivery is not connected yet, so no message was sent. Please return once official contact details are supplied.</p><Button className="mt-8" variant="outline" onClick={()=>setSubmitted(false)}>Edit your message</Button></div> : <form onSubmit={submit} className="grid gap-7 reveal" aria-label="Project enquiry form">
        <div className="grid gap-7 sm:grid-cols-2"><Field label="Name"><Input required name="name" autoComplete="name" placeholder="Your name" /></Field><Field label="Company"><Input name="company" autoComplete="organization" placeholder="Company name" /></Field></div>
        <div className="grid gap-7 sm:grid-cols-2"><Field label="Email"><Input required type="email" name="email" autoComplete="email" placeholder="you@company.com" /></Field><Field label="Phone"><Input type="tel" name="phone" autoComplete="tel" placeholder="Your phone number" /></Field></div>
        <div className="grid gap-7 sm:grid-cols-2"><SelectField label="Project Type" name="projectType" options={["New digital product","Existing product improvement","ERP solution","Product discovery","Design","Engineering","Other"]}/><SelectField label="Budget Range" name="budget" options={["Not decided yet","Under $10,000","$10,000–$25,000","$25,000–$50,000","$50,000+"]}/></div>
        <Field label="Project Description"><Textarea required name="description" className="min-h-44" placeholder="What are you trying to build, improve, or solve?" /></Field>
        <div className="flex flex-col gap-4 border-t border-border pt-7 sm:flex-row sm:items-center sm:justify-between"><p className="max-w-md text-xs leading-5 text-muted-foreground">This preview validates your details but does not send them until official contact delivery is connected.</p><Button size="lg" type="submit">Start a Conversation <ArrowRight/></Button></div>
      </form>}
    </div></section>
  </>;
}

function Field({label, children}:{label:string;children:ReactNode}) { return <label className="form-field"><span>{label}</span>{children}</label>; }
function SelectField({label,name,options}:{label:string;name:string;options:string[]}) { return <label className="form-field"><span>{label}</span><select name={name} required defaultValue=""><option value="" disabled>Select an option</option>{options.map(option=><option key={option}>{option}</option>)}</select></label>; }