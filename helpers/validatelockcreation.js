function validateCommonInputs(inputs, validationErrors) {
  // rearrange in order of CreatedLockFields to make sure everything gets validated
  if(inputs.Shared != false && inputs.Shared != true) {
    validationErrors.push("Shared is not valid");
  }	// enforced by schema?

  // LockName not required by schema, and a TypeError occurs if length is used on undefined
  // TODO: ??? Should lockName be required to not be null in db, models, schema, etc. ???
  if (inputs.LockName && inputs.LockName.length > 255) {
    validationErrors.push("Name too long");
  } // tested

  if(inputs.Allow_Fakes != false && inputs.Allow_Fakes != true) {
    validationErrors.push("Allow fakes is not valid");
  } //enforced by schema?
  if(inputs.Allow_Fakes === true) {
      if (inputs.Min_Fakes === undefined || inputs.Max_Fakes === undefined)
      {
          validationErrors.push('Numbers must be provided for both min and max fakes if fakes allowed')
      } // tested
      if(inputs.Min_Fakes > 19 || inputs.Min_Fakes < 0) { // neither true if undefined, even if
          validationErrors.push("Min fakes is not valid"); // undefined converted to zero
      } // tested including boundary
      if(inputs.Max_Fakes > 19 || inputs.Max_Fakes < 0) {
          validationErrors.push("Max fakes is not valid");
      } //tested including boundary
      if(inputs.Min_Fakes > inputs.Max_Fakes) {
          validationErrors.push("Min fakes is bigger than max fakes");
      } // tested
  }

  if(inputs.Checkins_Enabled != false && inputs.Checkins_Enabled != true) {
    validationErrors.push("Checkins enabled is not valid");
  } // enforced by schema?

  if(inputs.Checkins_Enabled === true) {
      if (inputs.Checkins_Frequency === undefined || inputs.Checkins_Window === undefined)
      {
          validationErrors.push('Frequency and window must be provided if checkins enabled')
      } // tested 
      if (inputs.Checkins_Frequency < 0.5 || inputs.Checkins_Frequency > 23940) {
          validationErrors.push("Checkins frequency is not valid");
      } // tested
      if (inputs.Checkins_Window < 0.25 || inputs.Checkins_Window > 23880) {
          validationErrors.push("Checkins window is not valid");
      } // tested
  }

  if(inputs.Allow_Buyout != false && inputs.Allow_Buyout != true) {
      validationErrors.push("Allow buyout is not valid");
  } // enforced by schema?

  if(inputs.Disable_Keyholder_Decision != false && inputs.Disable_Keyholder_Decision != true) {
      validationErrors.push("Disable keyholder permission is not valid");
  } // enforced by schema?

  if(inputs.Limit_Users != false && inputs.Limit_Users != true) {
      validationErrors.push("Limit users is not valid");
  } // enforced by schema?

  if(inputs.Limit_Users === true) {
      if (inputs.User_Limit_Amount === undefined)
      {
          validationErrors.push('Max users must be provided if users are limited')
      } // tested
      if(inputs.User_Limit_Amount > 100 || inputs.User_Limit_Amount < 1) {
          validationErrors.push("Limit users amount is not valid");
      } // tested including boundaries
  }

  if(inputs.Block_Test_Locks != false && inputs.Block_Test_Locks != true) {
      validationErrors.push("Block test users is not valid");
  } // enforced by schema?

  if(inputs.Block_User_Rating_Enabled != false && inputs.Block_User_Rating_Enabled != true) {
      validationErrors.push("Block user rating enabled is not valid");
  } // enforced by schema?

  if(inputs.Block_User_Rating_Enabled === true) {
      if (inputs.Block_User_Rating === undefined)
      {
          validationErrors.push('Min rating must be provided if users are blocked by rating')
      } // tested  
      if(inputs.Block_User_Rating > 5 || inputs.Block_User_Rating < 1) {
          validationErrors.push("User blocked rating is not valid");
      } // tested including boundaries
  }

  if(inputs.Block_Already_Locked != false && inputs.Block_Already_Locked != true) {
      validationErrors.push("Block already locked users is not valid");
  } // enforced by schema?

  if(inputs.Block_Stats_Hidden != false && inputs.Block_Stats_Hidden != true) {
      validationErrors.push("Block stat hidden users is not valid");
  }  // enforced by schema?

  if(inputs.Only_Accept_Trusted != false && inputs.Only_Accept_Trusted != true) {
      validationErrors.push("Only accept trusted users is not valid");
  }  // enforced by schema?

  if(inputs.Require_DM != false && inputs.Require_DM != true) {
      validationErrors.push("Require DM is not valid");
  }  // enforced by schema?
  if(inputs.Start_Lock_Frozen != false && inputs.Start_Lock_Frozen != true) {
    validationErrors.push("Start lock frozen is not valid");
  } // enforced by schema?
}

module.exports = {
  validateCommonInputs
}