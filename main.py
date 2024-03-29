"""
Copyright 2023 Google LLC

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    https://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
"""
from flask import Flask
from flask_pydantic import validate
from functions_wrapper import entrypoint
from werkzeug.exceptions import HTTPException

from core.http import handle_http_error
from core.http import handle_malformed_config
from core.http import handle_server_error
from core.http import MalformedConfigError
from routes.process_column import process_column

dqm = Flask(__name__)

dqm.route('/process_column', methods=['POST'])(validate()(process_column))

dqm.register_error_handler(MalformedConfigError, handle_malformed_config)
dqm.register_error_handler(HTTPException, handle_http_error)
dqm.register_error_handler(Exception, handle_server_error)

app = lambda request: entrypoint(dqm, request)  # noqa: E731
