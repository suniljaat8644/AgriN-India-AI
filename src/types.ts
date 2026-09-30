export type LanguageCode = 'en' | 'hi' | 'pa' | 'mr' | 'te' | 'ta' | 'gu';

export interface LanguageOption {
  code: LanguageCode;
  label: string;
  nativeLabel: string;
  speechCode: string;
}

export interface DiagnosisDetails {
  diseaseName: string;
  diseaseNameRegional: string;
  pathogenOrCause: string;
  category: 'Fungal' | 'Bacterial' | 'Viral' | 'Pest / Insect' | 'Nutrient Deficiency' | 'Abiotic / Physiological Stress';
  severity: 'Mild' | 'Moderate' | 'Severe' | 'Critical';
  confidence: number;
  visualSymptoms: string[];
  weatherSoilCorrelation: string;
}

export interface OrganicTreatment {
  stepNumber: number;
  title: string;
  titleRegional: string;
  category: string;
  preparation: string;
  dosageAndApplication: string;
  timeOfDay: string;
  materialsNeeded: string[];
}

export interface PreventativeMeasure {
  practice: string;
  practiceRegional?: string;
  benefit: string;
  timeline: string;
}

export interface GovernmentScheme {
  schemeName: string;
  schemeNameRegional?: string;
  applicableBenefit: string;
  actionStep: string;
  helplineOrPortal: string;
}

export interface SatelliteTelemetry {
  ndviValue: number;
  ndviStatus: string;
  soilMoistureThermalProfile: string;
  geospatialRiskAlert: string;
  actionableMitigation: string;
  satelliteSource?: string;
  coordinates?: string;
  soilMoisture?: number;
  surfaceTemp?: number;
}

export interface AdvisoryReport {
  diagnosis: DiagnosisDetails;
  organicTreatments: OrganicTreatment[];
  preventativeMeasures: PreventativeMeasure[];
  governmentSchemes: GovernmentScheme[];
  satelliteTelemetry?: SatelliteTelemetry;
  regionalVoiceSummary: string;
  kvkGuidance: string;
}

export interface FarmContext {
  stateDistrict: string;
  cropType: string;
  growthStage: string;
  soilCondition: string;
  weatherForecast: string;
  farmerQuery: string;
  language: LanguageCode;
  imageBase64?: string;
  imagePreview?: string;
  coordinates?: string;
  telemetryNdvi?: number;
  telemetrySoilMoisture?: number;
  telemetrySurfaceTemp?: number;
}

export interface PresetScenario {
  id: string;
  title: string;
  crop: string;
  location: string;
  stage: string;
  soil: string;
  weather: string;
  query: string;
  language: LanguageCode;
  badge: string;
  imageSampleKey?: string;
  coordinates?: string;
  telemetryNdvi?: number;
  telemetrySoilMoisture?: number;
  telemetrySurfaceTemp?: number;
}
