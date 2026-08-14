import mongoose from "mongoose";

const personaSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    personality: {
      type: String,
      required: true,
    },
    difficulty: {
      type: String,
      required: true,
    },
    systemPrompt: {
      type: String,
      required: true,
    },
    conversationRules: {
      type: String,
      required: true,
    },
    objections: {
      type: String,
      required: true,
    },
    job: {
      type: String,
      required: true,
    },
    company: {
      type: String,
      required: true,
    },
    industry: {
      type: String,
      required: true,
    },
    goals: {
      type: String,
      required: true,
    },
    currentProblems: {
      type: String,
      required: true,
    },
    budget: {
      type: String,
      required: true,
    },
    communicationStyle: {
      type: String,
      required: true,
    },
    hiddenGoal: {
      type: String,
      required: true,
    },

    successCriteria: {
      type: String,
      required: true,
    },

    failureCriteria: {
      type: String,
      required: true,
    },

    callEndReason: {
      type: String,
      required: true,
    },

    stageFlow: [
      {
        name: {
          type: String,
          required: true,
        },
        instructions: {
          type: String,
          required: true,
        },
      },
    ],

    skillLibrary: [
      {
        name: {
          type: String,
          required: true,
        },

        title: {
          type: String,
          required: true,
        },

        category: {
          type: String,
          required: true,
        },

        instructions: {
          type: String,
          required: true,
        },

        successCriteria: {
          type: String,
          required: true,
        },

        failureFeedback: {
          type: String,
          required: true,
        },
      },
    ],

    willingnessToBuy: {
      type: Number,
      min: 1,
      max: 10,
      required: true,
    },

    trustLevel: {
      type: Number,
      min: 1,
      max: 10,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

const Persona =
  mongoose.models.Persona || mongoose.model("Persona", personaSchema);

export default Persona;
