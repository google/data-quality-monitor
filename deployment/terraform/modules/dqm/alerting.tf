resource "google_monitoring_notification_channel" "basic" {
  count = var.notification_email != "" ? 1 : 0

  project      = var.project_id
  display_name = "DQM Notification Channel (${var.notification_email})"
  type         = "email"

  labels = {
    email_address = var.notification_email
  }

  force_delete = true
}

resource "google_monitoring_alert_policy" "dqm_workflow_errors" {
  project      = var.project_id
  display_name = "[DQM] Workflow execution error"
  combiner     = "OR"
  enabled      = var.enable_notifications

  conditions {
    display_name = "Workflow warnings and errors"

    condition_matched_log {
      filter = "resource.labels.workflow_id=\"${google_workflows_workflow.main.name}\" AND severity>=WARNING"
    }
  }

  alert_strategy {
    notification_rate_limit {
      period = var.notification_period
    }
    auto_close = "604800s"
  }

  notification_channels = length(google_monitoring_notification_channel.basic) > 0 ? [google_monitoring_notification_channel.basic[0].name] : []

  documentation {
    content   = "This alert indicates that an error occurred in the DQM Workflow. Review the logs [here](https://console.cloud.google.com/logs/viewer?project=${var.project_id}&advancedFilter=resource.labels.workflow_id=\"${google_workflows_workflow.main.name}\"%20AND%20severity>=WARNING)"
    mime_type = "text/markdown"
  }
}

resource "google_monitoring_alert_policy" "dqm_cloud_function_errors" {
  project      = var.project_id
  display_name = "[DQM] Cloud Function execution error"
  combiner     = "OR"
  enabled      = var.enable_notifications

  conditions {
    display_name = "Cloud Function errors"

    condition_matched_log {
      filter = "(resource.type=\"cloud_function\" resource.labels.function_name=\"${google_cloudfunctions_function.function.name}\") AND (severity>=ERROR OR textPayload:\"finished with status: 'error'\")"
    }
  }

  alert_strategy {
    notification_rate_limit {
      period = var.notification_period
    }
    auto_close = "604800s"
  }

  notification_channels = length(google_monitoring_notification_channel.basic) > 0 ? [google_monitoring_notification_channel.basic[0].name] : []

  documentation {
    content   = "This alert indicates that an error occurred in the DQM Cloud Function. Review the logs [here](https://console.cloud.google.com/logs/viewer?project=${var.project_id}&advancedFilter=(resource.type=\"cloud_function\" resource.labels.function_name=\"${google_cloudfunctions_function.function.name}\"\\)%20AND%20(severity>=ERROR%20OR%20textPayload:\"finished%20with%20status:%20'error'\"))"
    mime_type = "text/markdown"
  }
}

resource "google_monitoring_alert_policy" "dqm_violations" {
  project      = var.project_id
  display_name = "[DQM] Rule or Parser violations"
  combiner     = "OR"
  enabled      = var.enable_notifications

  conditions {
    display_name = "Rule violations, parse failures or rule errors"

    condition_matched_log {
      filter = "jsonPayload.response.code=\"200\" AND jsonPayload.response.description:\"DQM processed\" AND NOT jsonPayload.response.description:\"with 0 parse failures, 0 rule errors, 0 rule check violations.\" AND jsonPayload.description=\"Cloud Function Response\" AND resource.labels.workflow_id=\"${google_workflows_workflow.main.name}\""
    }
  }

  alert_strategy {
    notification_rate_limit {
      period = var.notification_period
    }
    auto_close = "604800s"
  }

  notification_channels = length(google_monitoring_notification_channel.basic) > 0 ? [google_monitoring_notification_channel.basic[0].name] : []

  documentation {
    content   = "This alert indicates that a rule was violated, a parser failed or a rule error occurred. Review the log table to see more details."
    mime_type = "text/markdown"
  }
}
