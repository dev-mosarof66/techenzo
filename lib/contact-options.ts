/**
 * Choices shown on the contact form when someone picks "Work together". Shared
 * by the form and the route so the select can never offer a value the schema
 * rejects. The lead workflow in n8n scores on these exact strings.
 */
export const LEAD_SERVICES = [
  "AI Chatbot",
  "Workflow Automation",
  "Lead Generation",
  "Other",
] as const;

export const LEAD_BUDGETS = ["Under $500", "$500-2,000", "$2,000+", "Not sure"] as const;
