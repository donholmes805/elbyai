import { GoogleGenAI, Content } from "@google/genai";
import { ChatPersona, ChatMessage, RegulatoryUpdate, HealthMetric } from '../types';

// Safely retrieve API key to prevent app crash if the `process` object is not defined in the environment.
const apiKey = (typeof process !== 'undefined' && process.env && process.env.API_KEY) || '';
if (!apiKey) {
    console.warn("API_KEY environment variable not set. AI features will not function.");
}

// Initialize the Google AI client.
// The API key is sourced from the environment variable `API_KEY`.
const ai = new GoogleGenAI({ apiKey });


const mockResponse = <T>(data: T, delay = 1000): Promise<T> => 
  new Promise(resolve => setTimeout(() => resolve(data), delay));

const MOCK_REGULATORY_NEWS: RegulatoryUpdate[] = [
    {
      id: 1,
      title: 'SEC Announces New Framework for Digital Asset Offerings',
      date: '2024-07-28',
      source: 'U.S. Securities and Exchange Commission',
      summary: 'The SEC has released a new guidance paper aimed at clarifying when digital assets may be considered securities. The framework introduces a more nuanced approach to the Howey Test in the context of decentralized networks.',
      tags: ['SEC', 'Regulation', 'USA'],
    },
    {
      id: 2,
      title: 'EU Parliament Approves MiCA Regulation',
      date: '2024-07-25',
      source: 'European Parliament',
      summary: 'The Markets in Crypto-Assets (MiCA) regulation has been formally approved, establishing a unified licensing regime for crypto-asset service providers across the European Union. The rules are expected to come into effect in 2025.',
      tags: ['MiCA', 'EU', 'Licensing'],
    },
    {
      id: 3,
      title: 'Singapore MAS Issues Stricter Rules for Crypto Exchanges',
      date: '2024-07-22',
      source: 'Monetary Authority of Singapore (MAS)',
      summary: 'MAS has updated its requirements for Digital Payment Token (DPT) service providers, focusing on customer protection, asset segregation, and risk management to bolster investor confidence.',
      tags: ['Singapore', 'MAS', 'Exchanges'],
    },
];

const MOCK_SYSTEM_HEALTH: HealthMetric[] = [
    { name: 'Gemini API', status: 'ok', value: 'Operational' },
    { name: 'Database Connection', status: 'ok', value: 'Connected' },
    { name: 'User Authentication', status: 'warn', value: 'Slightly elevated login times' },
    { name: 'Cache Service', status: 'error', value: 'Unresponsive' },
];


export const apiService = {
  getChatResponse: async (messages: ChatMessage[], persona: ChatPersona): Promise<string> => {
    if (!apiKey) {
        return "I'm sorry, but my AI capabilities are currently disabled due to a configuration issue. Please contact support.";
    }

    let systemInstruction = "";

    if (persona === ChatPersona.REGULATOR) {
        systemInstruction = "You are Chain Assistant, a specialized AI focusing on blockchain technology and its legal implications. You answer technical questions about smart contracts, DeFi, Web3 concepts, and regulatory frameworks like the Howey Test or MiCA. Your tone is professional and precise. Always end your response with a clear disclaimer that you are an AI assistant, not a human lawyer, and your response does not constitute financial or legal advice.";
    } else { // Default to Elby Assistant
        systemInstruction = "You are Elby, a helpful and friendly AI legal assistant. You provide clear, concise information on general legal topics. Your responses should be informative but not overly long. Always end your response with a clear disclaimer that you are an AI assistant, not a human lawyer, and your response does not constitute legal advice.";
    }

    const contents: Content[] = messages.map(msg => ({
      role: msg.sender === 'user' ? 'user' : 'model',
      parts: [{ text: msg.text }],
    }));

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: contents,
        config: {
          systemInstruction: systemInstruction,
        },
      });
      return response.text;
    } catch (error) {
      console.error("Error calling Gemini API:", error);
      // Provide a user-friendly error message
      return "I'm sorry, but I'm having trouble connecting to my knowledge base at the moment. Please try your request again in a few moments.";
    }
  },

  analyzeContract: async (contractAddress: string): Promise<string> => {
    if (!apiKey) {
        return "## Analysis Disabled\n\nThe AI analysis feature is currently disabled due to a configuration issue.";
    }
    if (!contractAddress || !contractAddress.startsWith('0x')) {
      return Promise.resolve("## Invalid Contract Address\n\nPlease provide a valid Ethereum-style contract address starting with '0x'.");
    }

    const systemInstruction = `You are an AI legal analyst specializing in blockchain and securities law. Your task is to provide a preliminary analysis based on the Howey Test. Your analysis must be structured using the IRAC (Issue, Rule, Analysis, Conclusion) framework. This is a preliminary, high-level analysis for informational purposes only and does not constitute legal advice. You must generate the response in well-formatted Markdown.`;
    
    const prompt = `
Analyze the potential for a token associated with the smart contract address \`${contractAddress}\` to be considered a security under the U.S. Howey Test. Given that you cannot access live blockchain data, base your analysis on common patterns and characteristics of tokens associated with smart contracts.

Provide the output in Markdown format with the following structure:
## Preliminary IRAC Analysis: Howey Test
**Contract:** \`${contractAddress}\`
*Disclaimer: This is an AI-generated analysis for informational purposes and does not constitute legal or financial advice. A qualified attorney should be consulted for a definitive legal opinion.*

### Issue
Whether tokens associated with the smart contract could be classified as "investment contracts" and therefore as securities under the U.S. Howey Test.

### Rule
State the four prongs of the Howey Test:
1. An investment of money
2. In a common enterprise
3. With a reasonable expectation of profits
4. To be derived from the entrepreneurial or managerial efforts of others.

### Analysis
Apply each prong of the Howey Test to hypothetical scenarios typical for a token project associated with this contract. Discuss how an "investment of money" might occur (e.g., exchanging ETH for tokens), what a "common enterprise" might look like (e.g., pooling of funds, horizontal or vertical commonality), the "expectation of profits" (e.g., through token appreciation, staking rewards), and the critical role of the "efforts of others" (e.g., core development team, marketing efforts, governance decisions).

### Conclusion
Provide a summary conclusion about the potential risk level (e.g., low, moderate, high) that the token could be classified as a security, based on the hypothetical analysis. Emphasize that this is not a definitive legal finding.
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                systemInstruction: systemInstruction,
            },
        });
        return response.text;
    } catch (error) {
        console.error("Error calling Gemini API for contract analysis:", error);
        return "I'm sorry, but I'm having trouble performing the analysis at the moment. Please try again later.";
    }
  },

  generatePlaybook: async (projectType: string, jurisdiction: string): Promise<string> => {
    if (!apiKey) {
        return "## Playbook Disabled\n\nThe AI playbook generator is currently disabled due to a configuration issue.";
    }
    const systemInstruction = `You are an AI legal tech consultant. You create high-level compliance playbooks for blockchain projects. Your tone is professional, informative, and structured. The playbook should be practical and provide actionable recommendations. This does not constitute legal advice. You must generate the response in well-formatted Markdown.`;
    
    const prompt = `
Generate a high-level compliance playbook for a project with the following characteristics:
- Project Type: ${projectType}
- Target Jurisdiction: ${jurisdiction}

Provide the output in Markdown format with the following structure:
## High-Level Compliance Playbook
**Project Type:** ${projectType}
**Jurisdiction:** ${jurisdiction}
*Disclaimer: This is a generated, high-level guide and not a substitute for professional legal counsel. Regulations are complex and subject to change.*

### 1. Corporate Structure & Formation
- **Recommendation:** Suggest an appropriate legal entity type (e.g., Foundation, LLC, AG) and a favorable jurisdiction for incorporation, considering the project type.
- **Action Item:** Provide a concrete next step, such as "Consult with corporate lawyers specializing in digital assets to formalize the entity."

### 2. Tokenomics & Securities Law
- **Recommendation:** Advise on structuring the token to have clear utility to mitigate securities risk under the laws of ${jurisdiction}. Mention key legal tests if applicable (e.g., Howey Test in the US, MiCA framework in the EU).
- **Action Item:** Suggest drafting a comprehensive legal memorandum or opinion on the token's classification.

### 3. Anti-Money Laundering (AML) / Know Your Customer (KYC)
- **Recommendation:** Explain the importance of implementing a risk-based AML/KYC program, especially for token sales or DeFi services.
- **Action Item:** Recommend partnering with a third-party KYC/AML provider to verify user identities and monitor transactions.

### 4. Data Privacy & Security
- **Recommendation:** Outline the need to comply with relevant data protection laws (e.g., GDPR in the EU, CCPA in California) if personal data is collected. Mention the importance of smart contract audits.
- **Action Item:** Recommend developing a clear privacy policy and engaging a reputable firm for a full security audit of all smart contracts.

### 5. Marketing & Community Guidelines
- **Recommendation:** Warn against using language that could imply an expectation of profit from the team's efforts (e.g., "investment," "guaranteed returns").
- **Action Item:** Suggest creating clear marketing guidelines for the team and community to follow, focusing on technology and utility.
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                systemInstruction: systemInstruction,
            },
        });
        return response.text;
    } catch (error) {
        console.error("Error calling Gemini API for playbook generation:", error);
        return "I'm sorry, but I'm having trouble generating the playbook at the moment. Please try again later.";
    }
  },

  getRegulatoryNews: async (): Promise<RegulatoryUpdate[]> => {
    return mockResponse(MOCK_REGULATORY_NEWS, 1500);
  },

  getSystemHealth: async (): Promise<HealthMetric[]> => {
    return mockResponse(MOCK_SYSTEM_HEALTH, 800);
  },

  privacyIDEA: {
    verifyToken: async (email: string, code: string): Promise<{ success: boolean }> => {
      console.log(`Verifying 2FA for ${email} with code ${code}`);
      // In a real scenario, this would involve getting a JWT and calling the privacyIDEA API.
      // For this mock, we'll just check for a specific code like "123456".
      const isValid = code === '123456';
      return mockResponse({ success: isValid }, 500);
    },
    enrollUser: async (email: string, code: string): Promise<{ success: boolean }> => {
      console.log(`Enrolling ${email} with verification code ${code}`);
      // Mocking the final verification step of enrollment.
      const isVerified = code === '123456';
      return mockResponse({ success: isVerified }, 500);
    }
  },
};