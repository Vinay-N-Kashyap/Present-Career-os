import os

part39_code = """
  h += `
  <!-- ========================================================================= -->
  <!-- PART XXXIX: GIT, GITHUB & VERSION CONTROL BASICS (60 DAYS) -->
  <!-- ========================================================================= -->
  <div class="page-break"></div>
  <div style="background: #0f172a; color: #ffffff; padding: 10pt 14pt; border-radius: 4pt; margin-bottom: 12pt; border-left: 6px solid #ea580c;">
    <div style="display: flex; justify-content: space-between; align-items: baseline;">
      <h1 style="color: #ffedd5; margin: 0; font-size: 14pt; border: none; padding: 0;">Part XXXIX: Deep Masterclass Blueprint &mdash; Git, GitHub &amp; Version Control Basics (60 Days &bull; 240 Quests)</h1>
      <span style="font-size: 9pt; color: #fdba74; font-weight: 700;"><code>course-git-version-control</code> &bull; Gate v2 True 9.8 Standard</span>
    </div>
    <p style="margin: 4pt 0 0 0; font-size: 8.5pt; color: #ffedd5;">
      <strong>Directorate:</strong> Principal Release Systems Engineer, Chief Open Source Architect &amp; VP of Developer Platform Infrastructure &bull; <strong>Pedagogical Cadence:</strong> Month 1 (Days 01&ndash;30 / 120 Quests) + Month 2 (Days 31&ndash;60 / 120 Quests) &bull; <strong>Volume:</strong> 240 Quests Total &bull; <strong>Sovereign Capstones:</strong> ApexGitOps (M1) &amp; ApexEnterpriseGitOps (M2)
    </p>
  </div>

  <h2>39.1 Month 1: Content-Addressable Storage, Plumbing Internals, Branching DAGs, Collaborative Remotes &amp; Release Workflows (Days 01&ndash;30 / 120 Quests)</h2>
  <p style="font-size: 8.2pt; color: #475569; margin-bottom: 8pt;">
    Month 1 establishes foundational and architectural mastery across the Git content-addressable storage model and developer workflows: SHA-1 and SHA-256 cryptographic hashing, internal object graph topology (.git/objects blobs, trees, commits, annotated tags), zlib compression, loose objects and staging index binary physics (.git/index cache tree format), working tree state transitions, configuration hierarchy (.gitconfig system, global, local, worktree) and identity attestation, atomic commit creation and semantic commit formatting, log inspection and forensic formatting (oneline, graph, stat, patch), relative revision arithmetic (HEAD~N, HEAD^N), graphical DAG inspection, deterministic branch divergence and pointer movement, fast-forward vs three-way merge algorithms, recursive merge strategy and conflict marker mechanics, interactive rebase internals and history rewriting, cherry-picking atomic commits, reflog disaster recovery and detached HEAD rescue, stash mechanics and stash stack indexing, cryptographic commit and tag signing with GPG/SSH, remote repository topology (protocols: HTTPS, SSH, file), remote tracking branch synchronization (fetch, pull, push, upstream tracking), merge conflicts across remote branches, pull request and code review engineering workflows, GitHub branch protection rules and CODEOWNERS review enforcement, Git Large File Storage (Git-LFS) pointer architecture and smudge/clean filters, and Capstone 1: ApexGitOps Sovereign Collaborative Repository Architecture Master Capstone Viva Gate.
  </p>

  ${(() => {
    let out = '';
    GIT_VERSION_CONTROL_MONTH_1_SPECS.forEach((day: any) => {
      out += renderGitVersionControlDayCard(day);
    });
    return out;
  })()}

  <div class="page-break"></div>
  <div style="background: #0f172a; color: #ffffff; padding: 10pt 14pt; border-radius: 4pt; margin-bottom: 12pt; border-left: 6px solid #ea580c;">
    <div style="display: flex; justify-content: space-between; align-items: baseline;">
      <h1 style="color: #ffedd5; margin: 0; font-size: 14pt; border: none; padding: 0;">Part XXXIX: Git, GitHub &amp; Version Control Basics &mdash; Month 2: Distributed Topology, Monorepo Scale, Enterprise Release Engineering, Hook Automation &amp; Governance (Days 31&ndash;60 / 120 Quests)</h1>
      <span style="font-size: 9pt; color: #fdba74; font-weight: 700;">Stage 4 &bull; Global Scale &amp; Principal Systems Architect Viva Gate</span>
    </div>
    <p style="margin: 4pt 0 0 0; font-size: 8.5pt; color: #ffedd5;">
      <strong>Month 2 Scope:</strong> Low-level Git plumbing tool suite and tree traversal (hash-object, cat-file, mktree, commit-tree, write-tree), Packfile format internals (.pack and .idx binary fanout tables), delta compression window heuristics and repacking physics, reachability bitmaps and commit-graph accelerated traversal, repository garbage collection mechanics (git gc, prune, pack-redundant) and dangling object salvage, monorepo scale bottlenecks and virtual filesystem layers, Git sparse-checkout cone mode patterns, multiple worktree orchestration (git worktree add/prune/lock), submodule pointer management and detached HEAD traps, git subtree vendoring and bi-directional cherry-picking, forensic history excavation with git log pickaxes (-S, -G, -L trace), automated root-cause localization with git bisect run and test scripts, catastrophic secret eradication with git-filter-repo and BFG Repo-Cleaner, client-side hook architecture (pre-commit, commit-msg, prepare-commit-msg), server-side push validation hooks (pre-receive, update), enterprise CI/CD integration with GitHub Actions (matrix builds, artifact caching, reusable workflows, OIDC cloud identity federation), GitOps declarative infrastructure patterns with ArgoCD/Flux and reconciliation loops, semantic versioning and release automation (Conventional Commits, release-please, automated changelog generation), SLSA Level 3 supply chain security (cosign artifact signing, software bill of materials [SBOM] attestation, signed git tags), SHA-1 to SHA-256 repository migration strategies, The Principal Release Platform Architect Migration RFC ($10M enterprise VCS modernization proposal), and Capstone 2: ApexEnterpriseGitOps Sovereign Distributed Version Control &amp; Enterprise Release Engineering Suite Master Capstone Viva Gate.
    </p>
  </div>

  <h2>39.2 Month 2: Distributed Topology, Monorepo Scale, Enterprise Release Engineering, Hook Automation &amp; Governance (Days 31&ndash;60 / 120 Quests)</h2>

  ${(() => {
    let out = '';
    GIT_VERSION_CONTROL_MONTH_2_SPECS.forEach((day: any) => {
      out += renderGitVersionControlDayCard(day);
    });
    return out;
  })()}

  <div class="page-break"></div>
  <h2>39.3 Git, GitHub &amp; Version Control Basics Milestone &amp; Capstone Viva Gates (Milestones 1&ndash;7 + 2 Capstone Vivas)</h2>
  <table class="data-table">
    <thead>
      <tr>
        <th style="width: 12%;">Milestone</th>
        <th style="width: 10%;">Day</th>
        <th style="width: 28%;">Milestone Gate Title</th>
        <th style="width: 50%;">Architectural Deliverable &amp; Invariant Defense</th>
      </tr>
    </thead>
    <tbody>
      <tr><td><strong>Milestone 1</strong></td><td>Day 05</td><td>ApexStorage Content-Addressable Storage &amp; Hash Integrity Suite</td><td>Direct blob, tree, and commit object serialization engine verifying SHA-1/SHA-256 integrity and zlib compression.</td></tr>
      <tr><td><strong>Milestone 2</strong></td><td>Day 10</td><td>ApexMerge Fast-Forward &amp; Three-Way Merge Engine Suite</td><td>Deterministic branch divergence resolution platform with recursive 3-way merge algorithms and conflict marker isolation.</td></tr>
      <tr><td><strong>Milestone 3</strong></td><td>Day 15</td><td>ApexRescue Reflog Disaster Recovery &amp; Rebase Engine Suite</td><td>Zero-data-loss commit recovery engine leveraging reflog traversal, interactive rebasing, and detached HEAD re-anchoring.</td></tr>
      <tr><td><strong>Milestone 4</strong></td><td>Day 22</td><td>ApexFlow Protected Branching &amp; Review Policy Suite</td><td>Institutional pull request governance engine enforcing required status checks, CODEOWNERS approval gates, and signed commit attestation.</td></tr>
      <tr><td><strong>Capstone 1</strong></td><td>Day 30</td><td><strong>Month 1 Capstone Viva Gate</strong></td><td><strong>ApexGitOps Sovereign Collaborative Repository Architecture Master Capstone:</strong> Complete multi-engineer version control repository featuring automated trunk-based flows, Git-LFS asset tracking, zero-downtime hotfix rebasing, and signed cryptographic release tags defended before Senior Review Board.</td></tr>
      <tr><td><strong>Milestone 4 (M2)</strong></td><td>Day 35</td><td>ApexPlumbing Custom Git Engine &amp; Tree Traversal Suite</td><td>Low-level C/Python/TypeScript Git plumbing tool suite inspecting object packfiles, delta compression windows, and commit reachability bitmaps.</td></tr>
      <tr><td><strong>Milestone 5</strong></td><td>Day 40</td><td>ApexScale Sparse Checkout &amp; Multi-Worktree Orchestrator Suite</td><td>Terabyte-scale monorepo development platform utilizing Git sparse-checkout cone mode, multi-worktree parallel branching, and scalar performance optimizations.</td></tr>
      <tr><td><strong>Milestone 6</strong></td><td>Day 45</td><td>ApexAudit Forensic History Reconstruction &amp; Secret Redaction Suite</td><td>Forensic repository auditing suite leveraging <code>git log -S/-G</code> pickaxes, automated <code>git bisect run</code> bug locator scripts, and <code>git-filter-repo</code> credential eradication.</td></tr>
      <tr><td><strong>Milestone 7</strong></td><td>Day 50</td><td>ApexAutomate Pre-Receive Hook &amp; Enterprise GitHub Actions CI/CD Platform</td><td>Sovereign server-side push validation hook suite and multi-stage GitHub Actions pipeline enforcing OIDC cloud authentication, SBOM generation, and cosign image signing.</td></tr>
      <tr><td><strong>Master Capstone</strong></td><td>Day 60</td><td><strong>Month 2 Master Capstone Viva</strong></td><td><strong>ApexEnterpriseGitOps Sovereign Distributed Version Control &amp; Enterprise Release Engineering Suite Master Capstone:</strong> Institutional monorepo release engineering and governance platform unifying SHA-256 migration, multi-tenant submodules/subtrees, GitOps reconciliation with ArgoCD/Flux, SLSA Level 3 provenance attestation, and disaster recovery RFC defended under live adversarial viva voce examination.</td></tr>
    </tbody>
  </table>
  `;
"""

file_path = 'scripts/visuals/compile-500p-srs-pdf.mts'
with open(file_path, 'r', encoding='utf-8') as f:
    text = f.read()

target = '    </tbody>\n  </table>\n  `;\n\n  return h;\n}'
if target not in text:
    # try with \r\n
    target = '    </tbody>\r\n  </table>\r\n  `;\r\n\r\n  return h;\r\n}'
    if target not in text:
        print("Target not found directly, searching...")
        idx = text.find('ApexEnterpriseAnalytics Full-Scale Financial Engineering')
        print("ApexEnterpriseAnalytics idx:", idx)
        if idx != -1:
            end_table_idx = text.find('</table>', idx)
            end_backtick_idx = text.find('`;', end_table_idx)
            return_idx = text.find('return h;', end_backtick_idx)
            print("Found indices:", end_table_idx, end_backtick_idx, return_idx)
            target = text[end_table_idx:return_idx]
            print("Target slice:", repr(target))

assert target in text, "Could not find insertion anchor!"

replacement = '    </tbody>\n  </table>\n  `;\n' + part39_code + '\n  return h;\n}'
text = text.replace(target, replacement, 1)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(text)

print("Successfully wired Part XXXIX into compile-500p-srs-pdf.mts!")
