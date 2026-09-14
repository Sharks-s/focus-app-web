export type RuleType = "WHITELIST" | "BLACKLIST";

export interface AppRuleResponse {
    id: number;
    keyword: string;
    ruleType: RuleType;
}

export interface CreateAppRuleRequest {
    keyword: string;
    ruleType: RuleType;
}