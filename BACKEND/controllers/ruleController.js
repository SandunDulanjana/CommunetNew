import Rule from '../models/ruleModel.js';

// Add a new rule
export const addRule = async (req, res) => {
  try {
    const { Rule_subject, discription } = req.body;
    console.log('Adding new rule:', { Rule_subject, discription });

    if (!Rule_subject || !discription) {
      return res.status(400).json({ 
        success: false,
        message: 'Rule subject and description are required' 
      });
    }

    const newRule = new Rule({
      Rule_subject,
      discription,
      date: Date.now()
    });

    const savedRule = await newRule.save();
    console.log('Rule saved successfully:', savedRule);
    
    res.status(201).json({ 
      success: true,
      message: 'Rule added successfully',
      rule: savedRule 
    });
  } catch (error) {
    console.error('Error adding rule:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error adding rule', 
      error: error.message 
    });
  }
};

// Display all rules
export const displayRules = async (req, res) => {
  try {
    const rules = await Rule.find();
    res.status(200).json({
      success: true,
      Allrules: rules,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Display a specific rule by ID
export const displayRuleById = async (req, res) => {
  try {
    const { id } = req.params;
    console.log('Attempting to fetch rule with ID:', id);

    if (!id) {
      console.log('No rule ID provided');
      return res.status(400).json({ message: 'Rule ID is required' });
    }

    const rule = await Rule.findById(id);
    console.log('Rule found:', rule);

    if (!rule) {
      console.log('Rule not found');
      return res.status(404).json({ message: 'Rule not found' });
    }

    res.status(200).json(rule);
  } catch (error) {
    console.error('Error fetching rule:', error);
    res.status(500).json({ message: 'Error fetching rule', error: error.message });
  }
};

// Update a rule
export const updateRule = async (req, res) => {
  try {
    const { id } = req.params;
    const { Rule_subject, discription } = req.body;
    console.log('Updating rule:', { id, Rule_subject, discription });

    if (!id) {
      return res.status(400).json({ message: 'Rule ID is required' });
    }

    const updatedRule = await Rule.findByIdAndUpdate(
      id,
      { 
        Rule_subject: Rule_subject,
        discription: discription,
        date: Date.now()
      },
      { new: true }
    );

    if (!updatedRule) {
      return res.status(404).json({ message: 'Rule not found' });
    }

    console.log('Rule updated successfully:', updatedRule);
    res.status(200).json({ 
      success: true,
      message: 'Rule updated successfully',
      rule: updatedRule 
    });
  } catch (error) {
    console.error('Error updating rule:', error);
    res.status(500).json({ message: 'Error updating rule', error: error.message });
  }
};

// Delete a rule
export const deleteRule = async (req, res) => {
  try {
    const { id } = req.params;
    console.log('Attempting to delete rule with ID:', id);

    if (!id) {
      console.log('No rule ID provided');
      return res.status(400).json({ 
        success: false,
        message: 'Rule ID is required' 
      });
    }

    const deletedRule = await Rule.findByIdAndDelete(id);
    console.log('Delete result:', deletedRule);

    if (!deletedRule) {
      console.log('Rule not found for deletion');
      return res.status(404).json({ 
        success: false,
        message: 'Rule not found' 
      });
    }

    console.log('Rule deleted successfully');
    res.status(200).json({ 
      success: true,
      message: 'Rule deleted successfully' 
    });
  } catch (error) {
    console.error('Error deleting rule:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error deleting rule',
      error: error.message 
    });
  }
}; 