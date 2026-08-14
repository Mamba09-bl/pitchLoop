import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    personaId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Persona",
      required: true,
    },

    sellingProduct: {
      type: String,
      required: true,
    },

    salesGoal: {
      type: String,
      required: true,
    },
    callNumber: {
      type: Number,
      default: 1,
    },
    selectedSkills: {
      type: [String],
      default: [],
    },

    currentSkillIndex: {
      type: Number,
      default: 0,
    },

    targetPain: {
      type: String,
      required: false, // optional
    },

    conversationMemory: {
      discussedTopics: {
        type: [String],
        default: [],
      },
      sellerClaims: {
        type: [String],
        default: [],
      },
    },

    buyerChecklist: {
      relevance: {
        type: Boolean,
        default: false,
      },
      painConfirmed: {
        type: Boolean,
        default: false,
      },
      objectionsResolved: {
        type: Boolean,
        default: false,
      },
      roiValidated: {
        type: Boolean,
        default: false,
      },
      implementationUnderstood: {
        type: Boolean,
        default: false,
      },
      decisionReady: {
        type: Boolean,
        default: false,
      },
    },

    buyerState: {
      trust: {
        type: Number,
        default: 0,
      },
      curiosity: {
        type: Number,
        default: 0,
      },
      urgency: {
        type: Number,
        default: 0,
      },
      irritation: {
        type: Number,
        default: 0,
      },
      confidence: {
        type: Number,
        default: 0,
      },
    },

    status: {
      type: String,
      enum: ["active", "completed"],
      default: "active",
    },

    currentStage: {
      type: String,
      default: "",
    },

    weakResponseCount: {
      type: Number,
      default: 0,
    },

    trust: {
      type: Number,
      default: 0,
    },

    status: {
      type: String,
      default: "active",
    },

    outcome: {
      type: String,
    },

    warningGiven: {
      type: Boolean,
      default: false,
    },

    messages: [
      {
        callNumber: {
          type: Number,
          required: true,
        },

        role: {
          type: String,
          required: true,
        },

        content: {
          type: String,
          required: true,
        },

        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    feedback: {
      overallScore: {
        type: Number,
        default: 0,
      },

      discoveryScore: {
        type: Number,
        default: 0,
      },

      communicationScore: {
        type: Number,
        default: 0,
      },

      objectionHandlingScore: {
        type: Number,
        default: 0,
      },

      closingScore: {
        type: Number,
        default: 0,
      },

      summary: {
        type: String,
        default: "",
      },

      strengths: [
        {
          title: String,
          explanation: String,
          evidence: String,
        },
      ],

      weaknesses: [
        {
          title: String,
          explanation: String,
          evidence: String,
        },
      ],

      missedOpportunities: [
        {
          situation: String,
          whyItMattered: String,
          betterResponse: String,
        },
      ],

      recommendation: {
        type: String,
        default: "",
      },
    },

    voiceCallFeedback: [
      {
        callNumber: {
          type: Number,
          required: true,
        },

        callOutcome: {
          goal: {
            type: String,
            default: "",
          },
          achieved: {
            type: Boolean,
            default: false,
          },
          reason: {
            type: String,
            default: "",
          },
        },

        overallScore: {
          score: {
            type: Number,
            default: 0,
          },
          label: {
            type: String,
            default: "",
          },
        },

        skillBreakdown: {
          openingAndRelevance: {
            type: Number,
            default: 0,
          },
          clarityAndConciseness: {
            type: Number,
            default: 0,
          },
          objectionHandling: {
            type: Number,
            default: 0,
          },
          goalAchievement: {
            type: Number,
            default: 0,
          },
        },

        strengths: [
          {
            title: String,
            explanation: String,
          },
        ],

        improvements: [
          {
            mistake: String,
            whyItMatters: String,
            howToImprove: String,
          },
        ],

        conversationMoments: [
          {
            buyerMessage: String,
            sellerAnswer: String,
            betterAnswer: String,
          },
        ],

        nextFocus: {
          title: {
            type: String,
            default: "",
          },
          explanation: {
            type: String,
            default: "",
          },
        },
      },
    ],

    coaching: {
      overallSummary: {
        type: String,
        default: "",
      },

      skills: [
        {
          name: String,
          status: String,
          whyItMatters: String,
          whatHappened: String,
        },
      ],
    },

    coaching: {
      overallSummary: {
        type: String,
        default: "",
      },

      skills: [
        {
          name: String,
          status: String,
          whyItMatters: String,
          whatHappened: String,
          practiceCompleted: {
            type: Boolean,
            default: false,
          },
        },
      ],
    },

    practice: {
      skillName: String,

      scenario: String,

      answers: [
        {
          answer: String,
          correct: Boolean,
        },
      ],

      attempts: {
        type: Number,
        default: 0,
      },

      completed: {
        type: Boolean,
        default: false,
      },
    },

    checkCallNumber: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
);

const session =
  mongoose.models.Session || mongoose.model("Session", sessionSchema);

export default session;
