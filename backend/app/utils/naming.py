import re


def pascal_case_to_snake_case_plural(name: str) -> str:
    """Convert PascalCase -> snake_case_plural.

    Examples:
      ReportType -> report_types
      UploadJob -> upload_jobs
      ValidationRule -> validation_rules
    """

    s1 = re.sub("(.)([A-Z][a-z]+)", r"\1_\2", name)
    snake = re.sub("([a-z0-9])([A-Z])", r"\1_\2", s1).lower()

    # naive pluralization is OK for prototype
    if snake.endswith("y") and not snake.endswith("ay") and not snake.endswith("ey"):
        return snake[:-1] + "ies"
    if snake.endswith("s"):
        return snake + "es"
    return snake + "s"
