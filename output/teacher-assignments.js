window.teacherAssignmentStore = (() => {
  const STORAGE_KEY = "teacher_assignments_v1";
  const DEFAULT_DETAIL_PAGE = "./金融创新与衍生品专题_作业批改结果_2026-03-26.html";

  function seedAssignments() {
    return [
      {
        id: "default_inventory_assignment",
        name: "大宗商品库存分析作业",
        submittedCount: 2,
        gradedCount: 2,
        createdAt: "2026-03-26",
        standardFileName: "大宗商品库存分析标准.md",
        collectionOpen: true,
        detailPage: DEFAULT_DETAIL_PAGE,
        usesCurrentReviewData: true
      }
    ];
  }

  function ensureStorage() {
    const existing = localStorage.getItem(STORAGE_KEY);
    if (!existing) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(seedAssignments()));
    }
  }

  function loadAssignments() {
    ensureStorage();
    try {
      const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
      return Array.isArray(parsed) ? parsed : seedAssignments();
    } catch {
      return seedAssignments();
    }
  }

  function saveAssignments(assignments) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(assignments));
  }

  function listAssignments() {
    return loadAssignments();
  }

  function getAssignment(id) {
    return loadAssignments().find(item => item.id === id) || null;
  }

  function createAssignment(payload) {
    const assignments = loadAssignments();
    const assignment = {
      id: `assignment_${Date.now()}`,
      name: payload.name,
      submittedCount: 0,
      gradedCount: 0,
      createdAt: payload.createdAt,
      standardFileName: payload.standardFileName,
      collectionOpen: false,
      detailPage: DEFAULT_DETAIL_PAGE,
      usesCurrentReviewData: false
    };
    assignments.unshift(assignment);
    saveAssignments(assignments);
    return assignment;
  }

  function toggleCollection(id) {
    const assignments = loadAssignments().map(item =>
      item.id === id ? { ...item, collectionOpen: !item.collectionOpen } : item
    );
    saveAssignments(assignments);
    return assignments.find(item => item.id === id) || null;
  }

  function deleteAssignment(id) {
    const assignments = loadAssignments().filter(item => item.id !== id);
    saveAssignments(assignments);
  }

  function syncCurrentReviewCounts(reviewData) {
    if (!reviewData || !Array.isArray(reviewData.students)) {
      return loadAssignments();
    }
    const assignments = loadAssignments().map(item => {
      if (!item.usesCurrentReviewData) return item;
      return {
        ...item,
        submittedCount: reviewData.students.length,
        gradedCount: reviewData.students.length
      };
    });
    saveAssignments(assignments);
    return assignments;
  }

  return {
    listAssignments,
    getAssignment,
    createAssignment,
    toggleCollection,
    deleteAssignment,
    syncCurrentReviewCounts
  };
})();
