import type {
  HistoricalExperimentAttempt,
  HistoricalExperimentStage,
  HistoricalSceneObject,
  HistoricalSourceReference,
  HistoricalVisualScene,
  ResearcherRealLab,
  SubjectKey
} from "@/types";

const accessedAt = "2026-05-28";

type LabSeed = {
  id: string;
  slug: string;
  subject: SubjectKey;
  title: string;
  subtitle: string;
  researcherNames: string[];
  period: string;
  location?: string;
  discoveryType: ResearcherRealLab["discoveryType"];
  coreQuestion: string;
  historicalContext: string;
  previousBeliefOrProblem: string;
  researchGoal: string;
  hypothesis: string;
  instruments: string[];
  sceneType: HistoricalVisualScene["sceneType"];
  objectTypes: HistoricalSceneObject["type"][];
  failedTitle: string;
  failedDescription: string;
  failureReason: string;
  successTitle: string;
  successDescription: string;
  successReason: string;
  discoveredConcepts: string[];
  relatedFormulaIds: string[];
  relatedLessonIds: string[];
  relatedSimulationLabIds: string[];
  safetyLevel: ResearcherRealLab["safetyLevel"];
  accuracyLevel: ResearcherRealLab["accuracyLevel"];
  limitations: string[];
  modernInterpretation: string;
  sources: HistoricalSourceReference[];
  challenge: {
    prompt: string;
    expectedAnswer: string;
    options: string[];
  };
  uncertaintyNotes?: string[];
};

function source(
  id: string,
  title: string,
  url: string,
  publisher: string,
  sourceType: HistoricalSourceReference["sourceType"],
  notes: string
): HistoricalSourceReference {
  return {
    id,
    title,
    url,
    publisher,
    accessedAt,
    sourceType,
    reliability: "high",
    notes
  };
}

function makeAssetPrompts(seed: LabSeed, stageTitle: string, state: "failed" | "success" | "neutral") {
  const apparatus = seed.instruments.join(", ");
  return {
    imagePrompt:
      `Create an educational historical science illustration for students. Subject: ${seed.title}. Stage: ${stageTitle}. ` +
      `Scientist(s): ${seed.researcherNames.join(", ")}. Period: ${seed.period}. Scene: ${seed.sceneType}. ` +
      `Main apparatus: ${apparatus}. Visual focus: annotated apparatus, cause-effect arrows, ${state} state. ` +
      "Style: clean educational illustration, historically inspired, not photorealistic, 16:9, clear labels, safe conceptual representation. Safety: do not show dangerous procedural details.",
    model3dPrompt:
      `Create a low-poly educational 3D model scene. Experiment: ${seed.title}. Stage: ${stageTitle}. ` +
      `Objects: ${apparatus}. Camera: orbit view, student-friendly. Labels: key instruments and measured quantity. ` +
      `Animation: show what moves and what is measured. Failure state: ${seed.failedDescription}. Success state: ${seed.successDescription}. ` +
      "Style: simplified, accurate enough for education, optimized for web, no dangerous procedural details.",
    animationPrompt:
      `Create a step-by-step educational animation for ${seed.title}. Show what the researcher changes, what is measured, ` +
      "what fails or succeeds, and how the observation leads to the conclusion. Use labels, arrows, slow motion, and clear cause-effect transitions. Avoid unsafe procedural details.",
    negativePrompt: "No unsafe procedural details, no exact hazardous operating instructions, no photorealistic accident scene.",
    historicalAccuracyNotes: [
      "Fact statements are tied to sourceReferences where available.",
      "Stage visuals are educational reconstructions, not exact laboratory replicas.",
      "Failure states are conceptual reconstructions when no direct failed attempt is documented."
    ]
  };
}

function makeObjects(seed: LabSeed): HistoricalSceneObject[] {
  return seed.objectTypes.map((type, index) => ({
    id: `${seed.slug}-object-${index + 1}`,
    name: seed.instruments[index] ?? type,
    type,
    description: `Đối tượng trực quan: ${seed.instruments[index] ?? type}.`,
    historicalRole: `Dùng để tạo hoặc quan sát hiện tượng chính trong ${seed.title}.`,
    visibleParameters: index === 0 ? seed.relatedFormulaIds : undefined,
    position: { x: 120 + index * 95, y: 180 + (index % 2) * 45 }
  }));
}

function makeScene(seed: LabSeed, id: string, title: string, description: string, action: "run-failed-attempt" | "run-successful-attempt" | "show-context"): HistoricalVisualScene {
  const objects = makeObjects(seed);
  return {
    id,
    title,
    description,
    sceneType: seed.sceneType,
    objects,
    camera: { mode: "step-guided", defaultZoom: 1, focusObjectId: objects[0]?.id },
    annotations: objects.slice(0, 4).map((object, index) => ({
      id: `${id}-annotation-${index + 1}`,
      objectId: object.id,
      label: object.name,
      explanation: object.historicalRole,
      sourceReferenceId: seed.sources[index % seed.sources.length]?.id
    })),
    animationTimeline: [
      {
        order: 1,
        action: "assemble-apparatus",
        description: `Lắp ráp ${seed.instruments.slice(0, 3).join(", ")}.`,
        affectedObjectIds: objects.slice(0, 3).map((object) => object.id),
        visibleEffect: "Dụng cụ xuất hiện cùng nhãn và mũi tên chỉ hướng."
      },
      {
        order: 2,
        action,
        description: action === "run-failed-attempt" ? seed.failedDescription : action === "run-successful-attempt" ? seed.successDescription : seed.historicalContext,
        affectedObjectIds: objects.map((object) => object.id),
        visibleEffect: action === "run-failed-attempt" ? seed.failureReason : action === "run-successful-attempt" ? seed.successReason : "Ghi chú bối cảnh xuất hiện quanh mô hình."
      },
      {
        order: 3,
        action: "derive-conclusion",
        description: seed.modernInterpretation,
        affectedObjectIds: objects.slice(0, 2).map((object) => object.id),
        visibleEffect: "Thẻ kết luận nối quan sát với khái niệm hoặc công thức."
      }
    ]
  };
}

function makeAttempt(seed: LabSeed, type: "failed" | "successful"): HistoricalExperimentAttempt {
  const failed = type === "failed";
  return {
    id: `${seed.id}-${type}-attempt`,
    title: failed ? seed.failedTitle : seed.successTitle,
    attemptType: failed ? "failed" : "successful",
    description: failed ? seed.failedDescription : seed.successDescription,
    setupChanges: failed ? ["Thiết lập ban đầu hoặc chưa đầy đủ", "Quan sát chưa tách được nguyên nhân"] : ["Thiết lập cải tiến", "Đo đạc tách được quan hệ quan trọng"],
    whyItFailedOrWorked: failed ? seed.failureReason : seed.successReason,
    observedData: [
      { label: "Quan sát", value: failed ? "chưa đầy đủ / dễ gây hiểu sai" : "quan hệ nhân quả rõ hơn" },
      { label: "Diễn giải", value: failed ? "cần điều chỉnh" : "ủng hộ khái niệm" }
    ],
    visualSceneId: failed ? `${seed.slug}-failed-scene` : `${seed.slug}-success-scene`,
    simulationBehavior: {
      showFailureState: failed,
      showSuccessState: !failed,
      animationDescription: failed ? seed.failedDescription : seed.successDescription,
      visibleCauseEffect: failed ? seed.failureReason : seed.successReason
    }
  };
}

const stageTemplates: Array<Pick<HistoricalExperimentStage, "stageType" | "title">> = [
  { stageType: "background", title: "Bối cảnh lịch sử" },
  { stageType: "question", title: "Câu hỏi nghiên cứu" },
  { stageType: "hypothesis", title: "Mô hình cũ hoặc giả thuyết ban đầu" },
  { stageType: "setup", title: "Thiết lập thí nghiệm đầu tiên" },
  { stageType: "failure", title: "Kết quả thất bại hoặc chưa đầy đủ" },
  { stageType: "adjustment", title: "Phân tích vì sao chưa đúng" },
  { stageType: "setup", title: "Thiết lập cải tiến" },
  { stageType: "measurement", title: "Đo đạc và quan sát" },
  { stageType: "success", title: "Kết quả thành công" },
  { stageType: "formula-derived", title: "Khái niệm, công thức hoặc định luật rút ra" },
  { stageType: "modern-application", title: "Cách hiểu hiện đại" },
  { stageType: "attempt", title: "Thử thách tương tác cho học sinh" },
  { stageType: "conclusion", title: "Nguồn tư liệu và điểm chưa chắc chắn" }
];

function makeStages(seed: LabSeed): HistoricalExperimentStage[] {
  return stageTemplates.map((template, index) => {
    const order = index + 1;
    const state = template.stageType === "failure" ? "failed" : template.stageType === "success" ? "success" : "neutral";
    const prompts = makeAssetPrompts(seed, template.title, state);
    const sourceIds = seed.sources.map((item) => item.id);
    const descriptionByType: Partial<Record<HistoricalExperimentStage["stageType"], string>> = {
      background: seed.historicalContext,
      question: seed.coreQuestion,
      hypothesis: seed.previousBeliefOrProblem,
      setup: order < 7 ? `Dụng cụ ban đầu: ${seed.instruments.join(", ")}.` : `Thiết lập cải tiến tập trung vào mục tiêu: ${seed.researchGoal}.`,
      failure: seed.failedDescription,
      adjustment: seed.failureReason,
      measurement: `Quan sát hoặc đo: ${seed.discoveredConcepts.join(", ")}.`,
      success: seed.successDescription,
      "formula-derived": `Quan sát này hỗ trợ: ${seed.relatedFormulaIds.join(", ") || seed.discoveredConcepts.join(", ")}.`,
      "modern-application": seed.modernInterpretation,
      attempt: seed.challenge.prompt,
      conclusion: `Nguồn tư liệu: ${seed.sources.map((sourceItem) => sourceItem.publisher).join(", ")}.`
    };

    return {
      id: `${seed.slug}-stage-${order}`,
      order,
      title: template.title,
      stageType: template.stageType,
      description: descriptionByType[template.stageType] ?? seed.researchGoal,
      researcherAction: template.stageType === "attempt" ? "Học sinh chọn cách diễn giải hoặc điều chỉnh thiết lập." : seed.researchGoal,
      instrumentUsed: seed.instruments,
      observedResult: template.stageType === "failure" ? seed.failedDescription : template.stageType === "success" ? seed.successDescription : seed.discoveredConcepts.join(", "),
      reasoning: template.stageType === "failure" ? seed.failureReason : template.stageType === "success" ? seed.successReason : seed.hypothesis,
      visualSceneId: template.stageType === "failure" ? `${seed.slug}-failed-scene` : template.stageType === "success" ? `${seed.slug}-success-scene` : `${seed.slug}-context-scene`,
      imagePrompt: prompts.imagePrompt,
      model3dPrompt: prompts.model3dPrompt,
      animationPrompt: prompts.animationPrompt,
      generatedAssetPrompt: prompts,
      sourceReferenceIds: sourceIds,
      studentInteraction:
        template.stageType === "attempt"
          ? {
              type: "choose-adjustment",
              prompt: seed.challenge.prompt,
              expectedAnswer: seed.challenge.expectedAnswer,
              options: seed.challenge.options
            }
          : undefined
    };
  });
}

function makeLab(seed: LabSeed): ResearcherRealLab {
  const failedAttempt = makeAttempt(seed, "failed");
  const successfulAttempt = makeAttempt(seed, "successful");

  return {
    id: seed.id,
    slug: seed.slug,
    subject: seed.subject,
    title: seed.title,
    subtitle: seed.subtitle,
    researcherNames: seed.researcherNames,
    period: seed.period,
    location: seed.location,
    discoveryType: seed.discoveryType,
    coreQuestion: seed.coreQuestion,
    historicalContext: seed.historicalContext,
    previousBeliefOrProblem: seed.previousBeliefOrProblem,
    researchGoal: seed.researchGoal,
    hypothesis: seed.hypothesis,
    experimentFlow: makeStages(seed),
    failedAttempts: [failedAttempt],
    successfulAttempt,
    discoveredConcepts: seed.discoveredConcepts,
    relatedFormulaIds: seed.relatedFormulaIds,
    relatedLessonIds: seed.relatedLessonIds,
    relatedSimulationLabIds: seed.relatedSimulationLabIds,
    relatedInlineLabIds: [],
    visualReconstruction: {
      id: `${seed.slug}-visual-reconstruction`,
      style: "mixed",
      scenes: [
        makeScene(seed, `${seed.slug}-context-scene`, "Context scene", seed.historicalContext, "show-context"),
        makeScene(seed, `${seed.slug}-failed-scene`, seed.failedTitle, seed.failedDescription, "run-failed-attempt"),
        makeScene(seed, `${seed.slug}-success-scene`, seed.successTitle, seed.successDescription, "run-successful-attempt")
      ]
    },
    sourceReferences: seed.sources,
    accuracyLevel: seed.accuracyLevel,
    safetyLevel: seed.safetyLevel,
    limitations: seed.limitations,
    modernInterpretation: seed.modernInterpretation,
    needsSourceVerification: false,
    uncertaintyNotes: seed.uncertaintyNotes
  };
}

const teslaSources = [
  source("source-tesla-britannica", "Nikola Tesla biography", "https://www.britannica.com/biography/Nikola-Tesla", "Britannica", "encyclopedia", "Used for Tesla's rotating magnetic field and induction motor context."),
  source("source-ac-britannica", "Electromagnetism and AC power history", "https://www.britannica.com/science/electromagnetism/Special-theory-of-relativity", "Britannica", "encyclopedia", "Used for AC transformer and late-1880s AC transmission context."),
  source("source-tesla-coil-britannica", "Tesla coil", "https://www.britannica.com/technology/Tesla-coil", "Britannica", "encyclopedia", "Used only for general AC transformer/Tesla electrical invention background, not as construction guidance.")
];

const seeds: LabSeed[] = [
  {
    id: "research-lab-tesla-ac",
    slug: "tesla-alternating-current",
    subject: "physics",
    title: "Nikola Tesla và hệ thống dòng điện xoay chiều",
    subtitle: "Từ từ trường quay đến động cơ cảm ứng và truyền tải AC",
    researcherNames: ["Nikola Tesla"],
    period: "Cuối thế kỷ 19",
    location: "Châu Âu và Hoa Kỳ",
    discoveryType: "invention",
    coreQuestion: "Làm thế nào để tạo và truyền tải điện năng hiệu quả trên khoảng cách xa?",
    historicalContext: "Cuối thế kỷ 19, hệ thống điện phát triển nhanh nhưng truyền tải xa bị giới hạn bởi tổn hao trên dây dẫn và khả năng thay đổi điện áp.",
    previousBeliefOrProblem: "Hệ thống DC có hạn chế trong việc nâng/hạ áp hiệu quả trong bối cảnh kỹ thuật thời đó; motor cũng cần cách tạo mô-men quay ổn định.",
    researchGoal: "Mô phỏng AC nhiều pha tạo từ trường quay, động cơ cảm ứng và transformer cho truyền tải điện.",
    hypothesis: "Nếu tạo được từ trường quay bằng AC nhiều pha, rotor có thể quay mà không cần cấp điện trực tiếp vào phần quay.",
    instruments: ["coil", "rotor", "stator", "AC generator", "transformer", "transmission wire"],
    sceneType: "machine-prototype",
    objectTypes: ["coil", "motor", "generator", "wire", "unknown", "lamp"],
    failedTitle: "Rotor không quay với từ trường đứng yên",
    failedDescription: "Trong tái hiện giáo dục, từ trường đứng yên hoặc không lệch pha làm rotor rung nhẹ hoặc đứng yên.",
    failureReason: "Không có vector từ trường quay liên tục nên không tạo mô-men quay ổn định.",
    successTitle: "Rotor quay với từ trường quay",
    successDescription: "AC nhiều pha tạo vector từ trường quay quanh stator, rotor tăng tốc và quay theo.",
    successReason: "Từ trường quay gây cảm ứng trong rotor, tạo mô-men quay và liên kết với ý tưởng động cơ cảm ứng.",
    discoveredConcepts: ["Alternating current", "Rotating magnetic field", "Induction motor", "Transformer-supported transmission"],
    relatedFormulaIds: ["electric-power", "power-loss-i2r", "sinusoidal-ac-voltage"],
    relatedLessonIds: ["phy-lesson-13", "phy-lesson-14"],
    relatedSimulationLabIds: ["circuit-ohm", "electric-field"],
    safetyLevel: "concept-only",
    accuracyLevel: "educational-reconstruction",
    limitations: ["Không tái hiện chi tiết kỹ thuật động cơ AC thật.", "Không hướng dẫn chế tạo thiết bị điện cao áp."],
    modernInterpretation: "AC, transformer và động cơ cảm ứng là nền tảng của hệ thống điện lực hiện đại; công thức P = UI và tổn hao I^2R giải thích vì sao truyền tải điện áp cao có lợi thế.",
    sources: teslaSources,
    challenge: {
      prompt: "Hãy làm rotor quay bằng cách chọn đúng kiểu từ trường.",
      expectedAnswer: "Từ trường quay",
      options: ["Từ trường đứng yên", "Từ trường quay", "Không có từ trường"]
    }
  },
  {
    id: "research-lab-faraday-induction",
    slug: "faraday-electromagnetic-induction",
    subject: "physics",
    title: "Faraday và cảm ứng điện từ",
    subtitle: "Nam châm chuyển động qua cuộn dây làm kim điện kế lệch",
    researcherNames: ["Michael Faraday"],
    period: "1831",
    location: "Royal Institution, London",
    discoveryType: "law",
    coreQuestion: "Khi nào từ trường có thể tạo ra dòng điện trong dây dẫn?",
    historicalContext: "Sau phát hiện liên hệ giữa điện và từ, câu hỏi lớn là liệu từ có thể tạo ra điện hay không.",
    previousBeliefOrProblem: "Nam châm đứng yên gần cuộn dây không tạo dòng điện liên tục, nên cần tách vai trò của chuyển động và biến thiên từ thông.",
    researchGoal: "Đưa nam châm vào/ra cuộn dây và quan sát điện kế.",
    hypothesis: "Dòng điện cảm ứng xuất hiện khi từ thông qua cuộn dây thay đổi.",
    instruments: ["magnet", "coil", "galvanometer", "wire"],
    sceneType: "magnet-coil",
    objectTypes: ["magnet", "coil", "unknown", "wire"],
    failedTitle: "Nam châm đứng yên",
    failedDescription: "Kim điện kế không lệch bền vững khi nam châm đứng yên so với cuộn dây.",
    failureReason: "Từ thông không thay đổi nên không có suất điện động cảm ứng rõ rệt.",
    successTitle: "Nam châm di chuyển",
    successDescription: "Khi nam châm đi vào/ra cuộn dây, kim điện kế lệch theo chiều chuyển động.",
    successReason: "Biến thiên từ thông tạo suất điện động cảm ứng, mô tả hiện đại bởi epsilon = -dPhi/dt.",
    discoveredConcepts: ["Electromagnetic induction", "Changing magnetic flux", "Induced current"],
    relatedFormulaIds: ["faraday-law"],
    relatedLessonIds: ["phy-lesson-13"],
    relatedSimulationLabIds: ["electric-field", "circuit-ohm"],
    safetyLevel: "safe-to-simulate",
    accuracyLevel: "source-backed",
    limitations: ["Renderer bỏ qua hình học cuộn dây chi tiết và độ nhạy dụng cụ thật."],
    modernInterpretation: "Máy phát điện, transformer và nhiều cảm biến hiện đại dựa trên cảm ứng điện từ.",
    sources: [
      source("source-faraday-britannica", "Effects of varying magnetic fields", "https://www.britannica.com/science/electromagnetism/Effects-of-varying-magnetic-fields", "Britannica", "encyclopedia", "Used for changing magnetic flux and induction context."),
      source("source-faraday-ri", "Faraday induction ring and coil", "https://citeseerx.ist.psu.edu/document?doi=33dfc7eb6ea8392b5dd83aef3a8456dd2876f38c&repid=rep1&type=pdf", "Royal Society / Royal Institution reference via paper", "paper", "Used for magnet, coil and galvanometer reconstruction notes.")
    ],
    challenge: { prompt: "Hãy tạo dòng điện cảm ứng trong cuộn dây.", expectedAnswer: "Di chuyển nam châm", options: ["Giữ nam châm đứng yên", "Di chuyển nam châm", "Bỏ cuộn dây"] }
  },
  {
    id: "research-lab-galileo-inclined-plane",
    slug: "galileo-inclined-plane",
    subject: "physics",
    title: "Galileo và mặt phẳng nghiêng",
    subtitle: "Làm chậm rơi tự do để đo chuyển động tăng tốc",
    researcherNames: ["Galileo Galilei"],
    period: "Thế kỷ 17",
    location: "Italy",
    discoveryType: "law",
    coreQuestion: "Quãng đường của vật tăng tốc liên hệ với thời gian như thế nào?",
    historicalContext: "Đo rơi tự do trực tiếp quá nhanh với dụng cụ đo thời gian thời Galileo.",
    previousBeliefOrProblem: "Mô hình Aristotle về chuyển động không mô tả định lượng gia tốc như vật lý hiện đại.",
    researchGoal: "Dùng mặt phẳng nghiêng làm chậm chuyển động và đo quãng đường theo thời gian.",
    hypothesis: "Quãng đường tăng theo bình phương thời gian trong chuyển động gia tốc đều.",
    instruments: ["inclined plane", "rolling ball", "time marker", "distance ruler"],
    sceneType: "inclined-plane",
    objectTypes: ["ramp", "unknown", "notebook", "unknown"],
    failedTitle: "Đo rơi tự do trực tiếp",
    failedDescription: "Vật rơi quá nhanh, sai số đo thời gian lớn.",
    failureReason: "Dụng cụ thời đó khó tách các mốc thời gian nhỏ trong rơi tự do.",
    successTitle: "Dùng mặt phẳng nghiêng",
    successDescription: "Quả cầu lăn chậm hơn, cho phép so sánh quãng đường với thời gian.",
    successReason: "Làm chậm chuyển động giữ được bản chất tăng tốc nhưng dễ đo hơn.",
    discoveredConcepts: ["Accelerated motion", "s proportional to t^2", "s = 1/2 at^2"],
    relatedFormulaIds: ["kinematics-distance"],
    relatedLessonIds: ["phy-lesson-1"],
    relatedSimulationLabIds: ["kinematics"],
    safetyLevel: "safe-to-simulate",
    accuracyLevel: "educational-reconstruction",
    limitations: ["Các chi tiết dụng cụ lịch sử được đơn giản hóa."],
    modernInterpretation: "Gia tốc đều được mô tả bằng đồ thị và phương trình động học trong cơ học hiện đại.",
    sources: [
      source("source-galileo-rice", "Galileo's Inclined Plane Experiment", "https://galileo.library.rice.edu/lib/student_work/experiment95/inclined_plane.html", "Rice University Galileo Project", "university", "Used for Galileo inclined-plane educational history."),
      source("source-galileo-ou", "Inclined plane instrument", "https://galileo.ou.edu/exhibits/inclined-plane-instrument.html", "University of Oklahoma Galileo exhibit", "university", "Used for apparatus reconstruction.")
    ],
    challenge: { prompt: "Chọn cách đo nào làm chuyển động đủ chậm để quan sát gia tốc.", expectedAnswer: "Mặt phẳng nghiêng", options: ["Chỉ rơi tự do", "Mặt phẳng nghiêng", "Không đo thời gian"] }
  },
  {
    id: "research-lab-newton-prism",
    slug: "newton-prism-spectrum",
    subject: "physics",
    title: "Newton và lăng kính ánh sáng",
    subtitle: "Ánh sáng trắng chứa nhiều màu",
    researcherNames: ["Isaac Newton"],
    period: "1660s",
    location: "Cambridge, England",
    discoveryType: "theory",
    coreQuestion: "Màu sắc do lăng kính tạo ra hay đã có trong ánh sáng trắng?",
    historicalContext: "Quang học trước Newton chưa có mô hình rõ ràng về cấu tạo của ánh sáng trắng.",
    previousBeliefOrProblem: "Màu có thể bị xem là do lăng kính làm biến đổi ánh sáng.",
    researchGoal: "Cho ánh sáng qua lăng kính và dùng lăng kính thứ hai để kiểm tra màu đơn sắc.",
    hypothesis: "Ánh sáng trắng gồm nhiều thành phần màu có độ khúc xạ khác nhau.",
    instruments: ["prism", "sunbeam", "screen", "second prism"],
    sceneType: "workbench",
    objectTypes: ["prism", "unknown", "unknown", "prism"],
    failedTitle: "Giải thích màu do lăng kính tạo ra",
    failedDescription: "Nếu chỉ dùng một lăng kính, học sinh có thể nghĩ lăng kính tạo màu.",
    failureReason: "Thiết lập ban đầu chưa tách được màu đơn sắc để kiểm tra.",
    successTitle: "Thí nghiệm với lăng kính thứ hai",
    successDescription: "Chùm màu tách ra không bị biến thành màu khác theo cách ánh sáng trắng bị tách.",
    successReason: "Màu là thành phần của ánh sáng trắng, không chỉ là lỗi của lăng kính.",
    discoveredConcepts: ["Visible spectrum", "Dispersion", "White light composition"],
    relatedFormulaIds: ["snell"],
    relatedLessonIds: ["phy-lesson-17"],
    relatedSimulationLabIds: ["optics-ray"],
    safetyLevel: "safe-to-simulate",
    accuracyLevel: "source-backed",
    limitations: ["Không mô phỏng đầy đủ bước sóng và chỉ số khúc xạ."],
    modernInterpretation: "Phổ ánh sáng được mô tả bằng bước sóng và tần số trong quang học hiện đại.",
    sources: [
      source("source-newton-iop", "Newton's visible spectrum", "https://spark.iop.org/newtons-visible-spectrum", "Institute of Physics", "official-organization", "Used for prism and crucial experiment summary."),
      source("source-newton-royal-society", "Newton and optics context", "https://royalsociety.org/", "Royal Society", "official-organization", "General institutional source for Newton's scientific context; detailed page should be verified.")
    ],
    challenge: { prompt: "Chọn cách kiểm tra màu có sẵn trong ánh sáng trắng.", expectedAnswer: "Dùng lăng kính thứ hai", options: ["Dùng lăng kính thứ hai", "Bỏ màn hứng", "Chặn toàn bộ ánh sáng"] }
  },
  {
    id: "research-lab-joule-heat",
    slug: "joule-paddle-wheel-heat",
    subject: "physics",
    title: "Joule và cơ năng chuyển thành nhiệt",
    subtitle: "Quả nặng rơi kéo cánh khuấy làm nước nóng lên",
    researcherNames: ["James Prescott Joule"],
    period: "1840s",
    location: "England",
    discoveryType: "formula",
    coreQuestion: "Công cơ học có thể chuyển thành nhiệt lượng với quan hệ định lượng không?",
    historicalContext: "Lý thuyết caloric từng xem nhiệt như một chất lưu, trong khi các thí nghiệm của Joule ủng hộ năng lượng bảo toàn.",
    previousBeliefOrProblem: "Chưa có bằng chứng định lượng rõ ràng nối công cơ học với nhiệt.",
    researchGoal: "Dùng quả nặng rơi làm quay cánh khuấy trong nước và đo nhiệt độ tăng.",
    hypothesis: "Công cơ học biến thành nhiệt làm nhiệt độ nước tăng.",
    instruments: ["falling weights", "paddle wheel", "water vessel", "thermometer"],
    sceneType: "machine-prototype",
    objectTypes: ["unknown", "unknown", "beaker", "thermometer"],
    failedTitle: "Đo nhiệt độ quá thô",
    failedDescription: "Nếu cách nhiệt và đo nhiệt độ kém, mức tăng nhiệt nhỏ dễ bị nhiễu che lấp.",
    failureReason: "Sai số nhiệt và mất mát năng lượng làm kết quả chưa rõ.",
    successTitle: "Cánh khuấy trong bình cách nhiệt",
    successDescription: "Quả nặng rơi làm cánh khuấy quay, nhiệt kế ghi tăng nhiệt độ nhỏ nhưng có hệ thống.",
    successReason: "Công cơ học được chuyển thành nội năng của nước.",
    discoveredConcepts: ["Mechanical equivalent of heat", "Energy conservation", "Q = mcDeltaT"],
    relatedFormulaIds: ["heat", "work"],
    relatedLessonIds: ["phy-lesson-8"],
    relatedSimulationLabIds: ["ideal-gas"],
    safetyLevel: "safe-to-simulate",
    accuracyLevel: "source-backed",
    limitations: ["Không tính mất mát nhiệt và ma sát ở trục chi tiết."],
    modernInterpretation: "Nhiệt là dạng truyền năng lượng và liên hệ với nội năng vi mô.",
    sources: [
      source("source-joule-britannica", "Mechanical equivalent of heat", "https://www.britannica.com/science/mechanical-equivalent-of-heat", "Britannica", "encyclopedia", "Used for mechanical equivalent of heat context."),
      source("source-joule-royal-society", "Heat, work and subtle fluids commentary", "https://pmc.ncbi.nlm.nih.gov/articles/PMC4360093/", "Royal Society / PMC", "paper", "Used for paddle-wheel experiment and historical interpretation.")
    ],
    challenge: { prompt: "Chọn dấu hiệu cho thấy cơ năng đã thành nhiệt.", expectedAnswer: "Nhiệt độ tăng", options: ["Nhiệt độ tăng", "Khối lượng nước biến mất", "Không đo gì"] }
  },
  {
    id: "research-lab-lavoisier-mass",
    slug: "lavoisier-conservation-of-mass",
    subject: "chemistry",
    title: "Lavoisier và bảo toàn khối lượng",
    subtitle: "Bình kín cho thấy khối lượng trước và sau phản ứng không đổi",
    researcherNames: ["Antoine Lavoisier"],
    period: "Cuối thế kỷ 18",
    location: "France",
    discoveryType: "law",
    coreQuestion: "Trong phản ứng hóa học, tổng khối lượng có mất đi hay không?",
    historicalContext: "Hóa học trước Lavoisier còn bị ảnh hưởng bởi phlogiston và các mô tả định tính.",
    previousBeliefOrProblem: "Phản ứng trong hệ mở có thể làm khí thoát ra, tạo cảm giác khối lượng mất đi.",
    researchGoal: "Cân hệ kín trước và sau phản ứng để theo dõi khối lượng.",
    hypothesis: "Nếu hệ kín, tổng khối lượng trước và sau phản ứng được bảo toàn.",
    instruments: ["sealed flask", "balance", "gas jar", "chemical sample"],
    sceneType: "glassware-setup",
    objectTypes: ["flask", "balance", "gas-jar", "chemical-sample"],
    failedTitle: "Bình mở làm khí thoát ra",
    failedDescription: "Khi phản ứng trong hệ mở, khí thoát ra làm cân nặng thay đổi.",
    failureReason: "Hệ mở không giữ toàn bộ sản phẩm và chất phản ứng.",
    successTitle: "Bình kín trên cân",
    successDescription: "Hệ kín giữ khí và chất rắn/lỏng, tổng khối lượng thực tế không đổi trong sai số giáo dục.",
    successReason: "Nguyên tử được sắp xếp lại, không biến mất trong phản ứng hóa học thông thường.",
    discoveredConcepts: ["Conservation of mass", "Quantitative chemistry", "Balanced equation"],
    relatedFormulaIds: ["stoichiometry"],
    relatedLessonIds: ["chem-lesson-10"],
    relatedSimulationLabIds: ["reaction-sandbox"],
    safetyLevel: "concept-only",
    accuracyLevel: "source-backed",
    limitations: ["Không mô tả quy trình phản ứng thật; chỉ mô phỏng cân bằng khối lượng."],
    modernInterpretation: "Bảo toàn khối lượng là nguyên tắc thực hành cho phản ứng hóa học thông thường; vật lý hiện đại tổng quát bằng bảo toàn khối-lượng-năng-lượng.",
    sources: [
      source("source-lavoisier-mass-britannica", "Conservation of mass", "https://www.britannica.com/science/conservation-of-mass", "Britannica", "encyclopedia", "Used for conservation of mass statement."),
      source("source-lavoisier-chemical-bonding", "The law of conservation of mass", "https://www.britannica.com/science/chemical-bonding/The-law-of-conservation-of-mass", "Britannica", "encyclopedia", "Used for Lavoisier and quantitative chemistry context.")
    ],
    challenge: { prompt: "Chọn thiết lập đúng để kiểm chứng bảo toàn khối lượng.", expectedAnswer: "Bình kín", options: ["Bình mở", "Bình kín", "Không dùng cân"] }
  },
  {
    id: "research-lab-mendeleev-periodic",
    slug: "mendeleev-periodic-table",
    subject: "chemistry",
    title: "Mendeleev và bảng tuần hoàn",
    subtitle: "Sắp xếp thẻ nguyên tố và để lại ô trống dự đoán",
    researcherNames: ["Dmitri Mendeleev"],
    period: "1869",
    location: "Russia",
    discoveryType: "theory",
    coreQuestion: "Có quy luật nào sắp xếp các nguyên tố để dự đoán tính chất chưa biết?",
    historicalContext: "Số nguyên tố biết được tăng nhanh, cần hệ thống phân loại có khả năng dự đoán.",
    previousBeliefOrProblem: "Sắp xếp chỉ theo khối lượng có những điểm bất thường và không giải thích tính chất lặp lại.",
    researchGoal: "Sắp xếp thẻ nguyên tố theo khối lượng và tính chất, chấp nhận để lại ô trống.",
    hypothesis: "Tính chất nguyên tố biến đổi có tính tuần hoàn theo thứ tự sắp xếp phù hợp.",
    instruments: ["element cards", "notebook", "periodic grid"],
    sceneType: "periodic-table-room",
    objectTypes: ["notebook", "unknown", "unknown"],
    failedTitle: "Sắp xếp cứng nhắc theo khối lượng",
    failedDescription: "Một số cặp nguyên tố không nằm đúng nhóm tính chất nếu chỉ bám vào khối lượng.",
    failureReason: "Cần kết hợp khối lượng với hóa trị và tính chất hóa học.",
    successTitle: "Để lại ô trống dự đoán",
    successDescription: "Bảng tuần hoàn có ô trống cho các nguyên tố chưa tìm thấy và dự đoán tính chất của chúng.",
    successReason: "Tính chất lặp lại tạo mẫu hình có sức dự đoán.",
    discoveredConcepts: ["Periodic law", "Predicted elements", "Element classification"],
    relatedFormulaIds: ["atomic-number", "valence"],
    relatedLessonIds: ["chem-lesson-3"],
    relatedSimulationLabIds: ["periodic-table"],
    safetyLevel: "safe-to-simulate",
    accuracyLevel: "source-backed",
    limitations: ["Bảng hiện đại dựa trên số hiệu nguyên tử, không chỉ khối lượng nguyên tử."],
    modernInterpretation: "Cấu trúc electron và số hiệu nguyên tử giải thích cơ sở sâu hơn của tính tuần hoàn.",
    sources: [
      source("source-mendeleev-britannica", "Mendeleev's periodic law", "https://www.britannica.com/science/chemistry/Mendeleevs-periodic-law", "Britannica", "encyclopedia", "Used for 1869 periodic law context."),
      source("source-mendeleev-predictions", "When Was the Periodic Table Invented?", "https://www.britannica.com/story/when-was-the-periodic-table-invented", "Britannica", "encyclopedia", "Used for predicted elements and gaps.")
    ],
    challenge: { prompt: "Khi tính chất không khớp với thứ tự khối lượng, nên làm gì?", expectedAnswer: "Để lại ô trống dự đoán", options: ["Ép theo khối lượng", "Để lại ô trống dự đoán", "Bỏ tính tuần hoàn"] }
  },
  {
    id: "research-lab-rutherford-gold-foil",
    slug: "rutherford-gold-foil",
    subject: "chemistry",
    title: "Rutherford và thí nghiệm lá vàng",
    subtitle: "Hạt alpha tiết lộ hạt nhân nhỏ đặc",
    researcherNames: ["Ernest Rutherford", "Hans Geiger", "Ernest Marsden"],
    period: "1909-1911",
    location: "University of Manchester",
    discoveryType: "atomic-model",
    coreQuestion: "Điện tích dương và khối lượng trong nguyên tử phân bố như thế nào?",
    historicalContext: "Mô hình plum pudding xem điện tích dương phân bố khá đều trong nguyên tử.",
    previousBeliefOrProblem: "Nếu điện tích dương trải rộng, alpha particles dự kiến chỉ lệch nhẹ.",
    researchGoal: "Bắn hạt alpha vào lá vàng mỏng và quan sát góc tán xạ.",
    hypothesis: "Tán xạ lớn sẽ tiết lộ vùng điện tích dương tập trung.",
    instruments: ["alpha source", "gold foil", "scintillation screen", "microscope"],
    sceneType: "atomic-model",
    objectTypes: ["atom", "metal-sample", "unknown", "lens"],
    failedTitle: "Mô hình plum pudding không giải thích lệch lớn",
    failedDescription: "Dự đoán hạt alpha hầu như đi thẳng hoặc lệch nhẹ.",
    failureReason: "Mô hình điện tích phân tán không tạo lực đẩy cực mạnh ở khoảng cách rất nhỏ.",
    successTitle: "Một số hạt alpha bị lệch mạnh",
    successDescription: "Phần lớn hạt đi thẳng, một số rất ít lệch góc lớn.",
    successReason: "Khối lượng và điện tích dương tập trung trong hạt nhân nhỏ.",
    discoveredConcepts: ["Nuclear atom", "Mostly empty atom", "Alpha scattering"],
    relatedFormulaIds: ["atomic-number", "atomic-mass"],
    relatedLessonIds: ["chem-lesson-0", "chem-lesson-1"],
    relatedSimulationLabIds: ["atom-model"],
    safetyLevel: "concept-only",
    accuracyLevel: "source-backed",
    limitations: ["Không mô phỏng vật liệu phóng xạ thật; chỉ là tán xạ khái niệm."],
    modernInterpretation: "Mô hình hạt nhân là tiền đề cho vật lý hạt nhân và mô hình nguyên tử hiện đại.",
    sources: [
      source("source-rutherford-britannica-atom", "Rutherford's nuclear model", "https://www.britannica.com/science/atom/Rutherfords-nuclear-model", "Britannica", "encyclopedia", "Used for gold foil experiment and nuclear model."),
      source("source-rutherford-nobel", "Ernest Rutherford facts", "https://www.nobelprize.org/prizes/chemistry/1908/rutherford/", "Nobel Prize", "official-organization", "Used for Rutherford background and radioactivity work.")
    ],
    challenge: { prompt: "Kết quả nào làm mô hình plum pudding gặp vấn đề?", expectedAnswer: "Lệch góc lớn", options: ["Tất cả hạt dừng lại", "Lệch góc lớn", "Không hạt nào đi qua"] }
  },
  {
    id: "research-lab-curie-radioactivity",
    slug: "marie-curie-radioactivity",
    subject: "chemistry",
    title: "Marie Curie và nghiên cứu phóng xạ",
    subtitle: "Đo hoạt tính để nhận ra polonium và radium",
    researcherNames: ["Marie Curie", "Pierre Curie"],
    period: "1898-1911",
    location: "Paris, France",
    discoveryType: "chemical-element",
    coreQuestion: "Vì sao một số mẫu khoáng vật phát xạ mạnh hơn uranium riêng lẻ?",
    historicalContext: "Sau Becquerel, phóng xạ là một tính chất mới cần được đo và giải thích.",
    previousBeliefOrProblem: "Hoạt tính phóng xạ ban đầu có thể bị gán đơn giản cho uranium trong mẫu.",
    researchGoal: "Đo hoạt tính của mẫu và suy luận có chất mới phát xạ mạnh.",
    hypothesis: "Nếu mẫu phát xạ mạnh hơn uranium tinh khiết, có thể có nguyên tố phóng xạ chưa biết.",
    instruments: ["radioactivity meter", "mineral sample", "notebook", "balance"],
    sceneType: "chemical-bench",
    objectTypes: ["unknown", "chemical-sample", "notebook", "balance"],
    failedTitle: "Chỉ gán tín hiệu cho uranium",
    failedDescription: "Cách giải thích ban đầu không giải thích được mẫu khoáng vật có hoạt tính cao bất thường.",
    failureReason: "Cần đo định lượng và so sánh nhiều mẫu để nhận ra thành phần mới.",
    successTitle: "Nhận ra chất mới có hoạt tính rất mạnh",
    successDescription: "Đo hoạt tính dẫn đến việc nhận ra polonium và radium ở mức lịch sử.",
    successReason: "Hoạt tính phóng xạ được dùng như dấu vết để suy luận về nguyên tố mới.",
    discoveredConcepts: ["Radioactivity", "Polonium", "Radium"],
    relatedFormulaIds: ["atomic-number"],
    relatedLessonIds: ["chem-lesson-0"],
    relatedSimulationLabIds: ["atom-model"],
    safetyLevel: "do-not-recreate-physically",
    accuracyLevel: "source-backed",
    limitations: ["Không mô tả quy trình tách chiết hay xử lý chất phóng xạ."],
    modernInterpretation: "Phóng xạ được hiểu qua vật lý hạt nhân và được quản lý bằng quy trình an toàn nghiêm ngặt.",
    sources: [
      source("source-curie-nobel-theme", "Marie and Pierre Curie and the discovery of polonium and radium", "https://www.nobelprize.org/prizes/themes/marie-and-pierre-curie-and-the-discovery-of-polonium-and-radium/", "Nobel Prize", "official-organization", "Used for polonium/radium discovery and radioactivity context."),
      source("source-curie-lecture", "Marie Curie Nobel Lecture", "https://www.nobelprize.org/prizes/chemistry/1911/marie-curie/lecture/", "Nobel Prize", "official-organization", "Used for Curie's own framing of radioactivity.")
    ],
    challenge: { prompt: "Trong mô phỏng an toàn, tín hiệu nào gợi ý có chất phóng xạ mới?", expectedAnswer: "Hoạt tính mạnh hơn dự kiến", options: ["Không có phóng xạ", "Hoạt tính mạnh hơn dự kiến", "Chỉ đổi màu"] }
  },
  {
    id: "research-lab-haber-bosch",
    slug: "haber-bosch-ammonia",
    subject: "chemistry",
    title: "Haber-Bosch và tổng hợp ammonia",
    subtitle: "Gắn nitrogen không khí thành NH3 ở mức khái niệm công nghiệp",
    researcherNames: ["Fritz Haber", "Carl Bosch"],
    period: "1909-1913",
    location: "Germany",
    discoveryType: "industrial-process",
    coreQuestion: "Làm thế nào biến nitrogen trong không khí thành ammonia để sản xuất phân bón?",
    historicalContext: "Nhu cầu nitrogen có thể dùng trong nông nghiệp tăng cao đầu thế kỷ 20.",
    previousBeliefOrProblem: "N2 rất bền, điều kiện thường cho hiệu suất ammonia thấp.",
    researchGoal: "Mô phỏng vai trò áp suất, nhiệt độ và xúc tác ở mức khái niệm, không đưa thông số vận hành chi tiết.",
    hypothesis: "Điều kiện phù hợp và xúc tác giúp N2 và H2 tạo NH3 với hiệu suất có ích.",
    instruments: ["pressure vessel", "catalyst bed", "gas feed", "ammonia outlet"],
    sceneType: "industrial-plant",
    objectTypes: ["pressure-gauge", "metal-sample", "gas-jar", "flask"],
    failedTitle: "Điều kiện chưa phù hợp",
    failedDescription: "N2 và H2 va chạm nhưng sản phẩm NH3 ít trong mô phỏng.",
    failureReason: "Liên kết ba N2 rất bền và cần điều kiện/xúc tác phù hợp để tăng tốc và cân bằng.",
    successTitle: "Mô hình có xúc tác và điều kiện công nghiệp",
    successDescription: "Mô phỏng cho thấy NH3 xuất hiện nhiều hơn khi điều kiện khái niệm được chọn đúng.",
    successReason: "Xúc tác và điều kiện thích hợp làm quá trình có tính công nghiệp.",
    discoveredConcepts: ["Nitrogen fixation", "Ammonia synthesis", "Industrial catalysis"],
    relatedFormulaIds: ["stoichiometry"],
    relatedLessonIds: ["chem-lesson-10", "chem-lesson-13"],
    relatedSimulationLabIds: ["reaction-sandbox", "reaction-temperature"],
    safetyLevel: "do-not-recreate-physically",
    accuracyLevel: "source-backed",
    limitations: ["Không cung cấp áp suất/nhiệt độ vận hành chi tiết hay quy trình thật."],
    modernInterpretation: "Haber-Bosch vẫn là quy trình nền tảng cho ammonia, đồng thời là mục tiêu giảm phát thải trong công nghệ hiện đại.",
    sources: [
      source("source-haber-britannica", "Haber-Bosch process", "https://www.britannica.com/technology/Haber-Bosch-process", "Britannica", "encyclopedia", "Used for process definition and Haber/Bosch roles."),
      source("source-bosch-nobel", "Carl Bosch facts", "https://www.nobelprize.org/prizes/chemistry/1931/bosch/facts/", "Nobel Prize", "official-organization", "Used for high-pressure industrial development context."),
      source("source-haber-nobel-2007", "Nobel chemistry 2007 illustrated presentation", "https://www.nobelprize.org/nobel_prizes/chemistry/laureates/2007/illpres/page_02.html", "Nobel Prize", "official-organization", "Used for educational summary of nitrogen to ammonia.")
    ],
    challenge: { prompt: "Chọn bộ điều kiện khái niệm giúp tăng NH3 trong mô phỏng.", expectedAnswer: "Xúc tác với áp suất phù hợp", options: ["Không xúc tác", "Xúc tác với áp suất phù hợp", "Chỉ để ngoài không khí"] }
  },
  {
    id: "research-lab-oxygen-discovery",
    slug: "oxygen-discovery-priestley-scheele-lavoisier",
    subject: "chemistry",
    title: "Phát hiện oxygen: Priestley, Scheele và Lavoisier",
    subtitle: "Một lịch sử phức tạp của khí mới và cách hiểu lại sự cháy",
    researcherNames: ["Joseph Priestley", "Carl Wilhelm Scheele", "Antoine Lavoisier"],
    period: "1770s",
    location: "Europe",
    discoveryType: "chemical-element",
    coreQuestion: "Khi nào chất khí mới giải thích sự cháy và hô hấp tốt hơn phlogiston?",
    historicalContext: "Nhiều nhà hóa học độc lập nghiên cứu các loại 'air' mới trong thế kỷ 18.",
    previousBeliefOrProblem: "Phlogiston theory không giải thích tốt vai trò của khí trong sự cháy và tăng khối lượng oxit.",
    researchGoal: "Mô phỏng thu khí và vai trò oxygen trong cháy ở mức khái niệm, không hướng dẫn thí nghiệm thật.",
    hypothesis: "Một thành phần trong không khí hỗ trợ sự cháy và cần được xem là chất riêng.",
    instruments: ["gas jar", "burning splint", "chemical sample", "notebook"],
    sceneType: "glassware-setup",
    objectTypes: ["gas-jar", "burner", "chemical-sample", "notebook"],
    failedTitle: "Giải thích bằng phlogiston",
    failedDescription: "Mô hình cũ không giải thích nhất quán vai trò của khí mới trong sự cháy.",
    failureReason: "Cần cách hiểu oxygen là thành phần hoạt động trong không khí và sự cháy.",
    successTitle: "Oxygen được đặt trong lý thuyết mới",
    successDescription: "Priestley/Scheele liên quan đến thu khí, Lavoisier giải thích và đặt tên oxygen trong lý thuyết cháy mới.",
    successReason: "Lịch sử phát hiện có nhiều đóng góp, không nên gán cho một người duy nhất.",
    discoveredConcepts: ["Oxygen", "Combustion", "Chemical revolution"],
    relatedFormulaIds: ["stoichiometry"],
    relatedLessonIds: ["chem-lesson-10"],
    relatedSimulationLabIds: ["reaction-sandbox"],
    safetyLevel: "concept-only",
    accuracyLevel: "partially-uncertain",
    limitations: ["Không mô tả quy trình tạo/thu khí; chỉ mô phỏng khái niệm lịch sử."],
    modernInterpretation: "Oxygen là nguyên tố hóa học và tác nhân trong nhiều quá trình oxi hóa; lịch sử phát hiện có nhiều người đóng góp.",
    uncertaintyNotes: ["Credit for oxygen discovery is historically shared and contested across Scheele, Priestley and Lavoisier."],
    sources: [
      source("source-oxygen-britannica", "Oxygen", "https://www.britannica.com/science/oxygen", "Britannica", "encyclopedia", "Used for oxygen discovery overview."),
      source("source-priestley-britannica", "Joseph Priestley and oxygen", "https://www.britannica.com/biography/Joseph-Priestley/The-discovery-of-oxygen-and-the-chemical-revolution", "Britannica", "encyclopedia", "Used for Priestley informing Lavoisier and Lavoisier's interpretation."),
      source("source-lavoisier-oxygen-britannica", "Lavoisier oxygen theory of combustion", "https://www.britannica.com/biography/Antoine-Lavoisier/Oxygen-theory-of-combustion", "Britannica", "encyclopedia", "Used for oxygen theory and combustion context.")
    ],
    challenge: { prompt: "Chọn phát biểu đúng về lịch sử oxygen.", expectedAnswer: "Có nhiều người đóng góp", options: ["Một người duy nhất phát hiện", "Có nhiều người đóng góp", "Không liên quan đến sự cháy"] }
  }
];

export const researcherRealLabs: ResearcherRealLab[] = seeds.map(makeLab);

export function getResearcherRealLab(slug: string) {
  return researcherRealLabs.find((lab) => lab.slug === slug);
}

export function getResearcherRealLabsBySubject(subject: string) {
  return researcherRealLabs.filter((lab) => lab.subject === subject);
}

