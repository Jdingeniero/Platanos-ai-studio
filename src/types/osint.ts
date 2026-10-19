export interface TargetFileItem {
  id: string;
  name: string;
  path: string;
  size: string;
  lastModified: string;
  mimeType: string;
  description: string;
  downloadUrl?: string;
  isConfidential: boolean;
  metadata: {
    title: string;
    author: string;
    creatorTool: string;
    producer: string;
    creationDate: string;
    modifyDate: string;
    operatingSystem?: string;
    internalIp?: string;
    gpsCoordinates?: {
      lat: number;
      lng: number;
      locationName: string;
    };
    softwareVersion?: string;
    leakedInfo: string[];
    rawExif: Record<string, string>;
  };
}

export interface EmployeeProfile {
  id: string;
  name: string;
  role: string;
  department: string;
  email: string;
  phone: string;
  bio: string;
  githubAlias?: string;
  githubRepoName?: string;
  avatarPlaceholderText: string;
  socialFootprint: {
    platform: string;
    url: string;
    leakNotes: string;
  }[];
}

export interface SearchResult {
  id: string;
  title: string;
  url: string;
  snippet: string;
  matchedDorkCategory: string;
  filetype?: string;
  cachedHtml?: string;
  findingReferenceId?: string;
  confidentialBadge?: string;
}

export interface GoogleOperator {
  operator: string;
  syntax: string;
  description: string;
  purposeInSecurity: string;
  practicalExample: string;
  educationalLevel: 'Básico' | 'Intermedio' | 'Avanzado';
}

export interface ExpectedFinding {
  id: string;
  code: string;
  category: 'Metadatos' | 'Robots / Indexado' | 'Directorio Abierto' | 'GitHub / Fuga de Código' | 'Subdominios / DNS' | 'Credenciales';
  title: string;
  severity: 'Crítica' | 'Alta' | 'Media' | 'Baja';
  recommendedDork: string;
  whereFound: string;
  evidence: string;
  cyberRisk: string;
  defensiveFix: string;
  points: number;
}

export interface StudentFindingEntry {
  id: string;
  dorkUsed: string;
  searchObjective: string;
  obtainedResults: string;
  cyberSecurityRelevance: string;
  timestamp: string;
  verifiedAgainstExpectedId?: string;
}

export interface StudentReportData {
  studentName: string;
  studentGroup: string;
  date: string;
  section1Intro: string;
  section2Operators: {
    operator: string;
    explanation: string;
    practicalExample: string;
  }[];
  section3Findings: StudentFindingEntry[];
  section4Ethics: {
    whenAppropriate: string;
    associatedRisks: string;
    distinguishLegitimateVsAbuse: string;
  };
  section5Conclusions: {
    learnedReflections: string;
    hardeningRecommendations: string;
  };
  section6PresentationNotes: string;
}
